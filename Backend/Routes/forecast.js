import express from 'express';
import axios from 'axios';
import Movement from '../models/Movement.js';
import Stock from '../models/Stock.js';
import Product from '../models/Product.js';
import Branch from '../models/Branch.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate AI Forecast
router.post('/generate', auth, async (req, res) => {
    const { branchId, productId } = req.body;

    try {
        // Fetch product and branch details
        const product = await Product.findById(productId);
        const branch = await Branch.findById(branchId);

        if (!product || !branch) {
            return res.status(404).json({ error: 'Product or Branch not found' });
        }

        // Fetch historical OUT movements for this product at this branch
        const history = await Movement.find({
            product: productId,
            fromBranch: branchId,
            type: 'OUT'
        }).sort({ date: 1 });

        // Aggregate sales by month
        const salesData = history.reduce((acc, curr) => {
            const date = new Date(curr.date);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            acc[month] = (acc[month] || 0) + curr.quantity;
            return acc;
        }, {});

        const salesText = Object.entries(salesData).map(([k, v]) => `${k}: ${v} units`).join('\n');

        // Demo data if no history exists
        const demoSalesText = `
2025-01: 120 units
2025-02: 135 units
2025-03: 150 units
2025-04: 180 units
2025-05: 160 units
2025-06: 200 units
2025-07: 210 units
2025-08: 195 units
        `.trim();

        const dataToUse = salesText || demoSalesText;

        const prompt = `
You are an expert inventory forecasting AI for an enterprise inventory management system.

Product: ${product.name} (SKU: ${product.sku})
Branch: ${branch.name} - ${branch.location}
Current Min Stock Level: ${product.minStockLevel}

Historical Monthly Sales Data:
${dataToUse}

Task: Analyze the sales trend and predict demand for the next 3 months. Consider:
- Seasonal patterns
- Growth trends
- Any anomalies

Return ONLY a valid JSON object (no markdown, no code blocks) with this exact structure:
{
    "forecast": [
        { "month": "YYYY-MM", "predictedAmount": <number>, "rationale": "brief explanation" },
        { "month": "YYYY-MM", "predictedAmount": <number>, "rationale": "brief explanation" },
        { "month": "YYYY-MM", "predictedAmount": <number>, "rationale": "brief explanation" }
    ],
    "recommendation": "Detailed recommendation on restock quantity and timing",
    "insights": "Key insights about the demand pattern"
}
`;

        const response = await axios.post(
            process.env.GROK_ENDPOINT,
            {
                model: process.env.GROK_MODEL,
                messages: [
                    { role: "system", content: "You are an intelligent inventory forecasting assistant. Always return valid JSON only." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROK_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        let prediction = response.data.choices[0].message.content;

        // Clean up markdown formatting if present
        prediction = prediction.replace(/```json/g, '').replace(/```/g, '').trim();

        try {
            const jsonPrediction = JSON.parse(prediction);
            res.json({
                ...jsonPrediction,
                product: {
                    name: product.name,
                    sku: product.sku
                },
                branch: {
                    name: branch.name,
                    location: branch.location
                }
            });
        } catch (e) {
            console.error('JSON Parse Error:', e);
            res.json({
                raw: prediction,
                error: "Failed to parse AI response as JSON",
                product: {
                    name: product.name,
                    sku: product.sku
                },
                branch: {
                    name: branch.name,
                    location: branch.location
                }
            });
        }

    } catch (err) {
        console.error('Forecast Error:', err);
        res.status(500).json({
            error: 'Forecast generation failed',
            details: err.response?.data || err.message
        });
    }
});

// Get dashboard analytics
router.get('/analytics', auth, async (req, res) => {
    try {
        const products = await Product.countDocuments();
        const branches = await Branch.countDocuments();
        const stocks = await Stock.find().populate('product');

        let totalValue = 0;
        let lowStockCount = 0;

        stocks.forEach(stock => {
            if (stock.product) {
                totalValue += stock.quantity * (stock.product.price || 0);
                if (stock.quantity < stock.product.minStockLevel) {
                    lowStockCount++;
                }
            }
        });

        const recentMovements = await Movement.find()
            .sort({ date: -1 })
            .limit(10)
            .populate('product', 'name sku')
            .populate('fromBranch', 'name')
            .populate('toBranch', 'name');

        res.json({
            totalProducts: products,
            totalBranches: branches,
            totalStockItems: stocks.length,
            lowStockCount,
            totalInventoryValue: Math.round(totalValue),
            recentMovements
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
