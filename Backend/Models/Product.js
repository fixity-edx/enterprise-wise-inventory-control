import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number, required: true },
    cost: { type: Number },
    minStockLevel: { type: Number, default: 10 },
    unit: { type: String, default: 'pcs' },
    supplier: { type: String }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
