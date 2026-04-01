import express from 'express';
import Product from '../models/Product.js';
import Stock from '../models/Stock.js';
import Movement from '../models/Movement.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all products
router.get('/products', auth, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single product
router.get('/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add Product
router.post('/products', auth, async (req, res) => {
    const { sku, name, description, price, minStockLevel, category, cost, unit, supplier } = req.body;
    try {
        let product = await Product.findOne({ sku });
        if (product) return res.status(400).json({ msg: 'Product with this SKU already exists' });

        product = new Product({
            sku,
            name,
            description,
            price,
            minStockLevel,
            category,
            cost,
            unit,
            supplier
        });
        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update Product
router.put('/products/:id', auth, async (req, res) => {
    const { name, description, price, minStockLevel, category, cost, unit, supplier } = req.body;
    try {
        let product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.minStockLevel = minStockLevel || product.minStockLevel;
        product.category = category || product.category;
        product.cost = cost || product.cost;
        product.unit = unit || product.unit;
        product.supplier = supplier || product.supplier;

        await product.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete Product
router.delete('/products/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Stock by Branch
router.get('/stock/:branchId', auth, async (req, res) => {
    try {
        const stock = await Stock.find({ branch: req.params.branchId })
            .populate('product')
            .populate('branch');
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all stock
router.get('/stock', auth, async (req, res) => {
    try {
        const stock = await Stock.find()
            .populate('product')
            .populate('branch');
        res.json(stock);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Stock Movement (IN/OUT/TRANSFER/ADJUSTMENT)
router.post('/movements', auth, async (req, res) => {
    const { productId, branchId, type, quantity, reason, notes, toBranchId } = req.body;

    try {
        const qty = parseInt(quantity);

        // Handle stock for the source branch
        if (type === 'OUT' || type === 'TRANSFER') {
            let stock = await Stock.findOne({ product: productId, branch: branchId });
            if (!stock || stock.quantity < qty) {
                return res.status(400).json({ msg: 'Insufficient stock' });
            }
            stock.quantity -= qty;
            stock.lastUpdated = Date.now();
            await stock.save();
        }

        // Handle stock for IN or destination branch in TRANSFER
        if (type === 'IN' || type === 'ADJUSTMENT') {
            let stock = await Stock.findOne({ product: productId, branch: branchId });
            if (!stock) {
                stock = new Stock({ product: productId, branch: branchId, quantity: 0 });
            }
            stock.quantity += qty;
            stock.lastUpdated = Date.now();
            await stock.save();
        }

        // Handle destination branch for TRANSFER
        if (type === 'TRANSFER' && toBranchId) {
            let destStock = await Stock.findOne({ product: productId, branch: toBranchId });
            if (!destStock) {
                destStock = new Stock({ product: productId, branch: toBranchId, quantity: 0 });
            }
            destStock.quantity += qty;
            destStock.lastUpdated = Date.now();
            await destStock.save();
        }

        // Log the movement
        const movement = new Movement({
            type,
            product: productId,
            fromBranch: (type === 'OUT' || type === 'TRANSFER') ? branchId : null,
            toBranch: (type === 'IN') ? branchId : (type === 'TRANSFER' ? toBranchId : null),
            quantity: qty,
            reason,
            notes,
            user: req.user.id
        });
        await movement.save();

        res.json({ msg: 'Stock movement recorded successfully', movement });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all movements
router.get('/movements', auth, async (req, res) => {
    try {
        const movements = await Movement.find()
            .populate('product')
            .populate('fromBranch')
            .populate('toBranch')
            .populate('user', 'name email')
            .sort({ date: -1 })
            .limit(100);
        res.json(movements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get movements by product
router.get('/movements/product/:productId', auth, async (req, res) => {
    try {
        const movements = await Movement.find({ product: req.params.productId })
            .populate('product')
            .populate('fromBranch')
            .populate('toBranch')
            .populate('user', 'name email')
            .sort({ date: -1 });
        res.json(movements);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
