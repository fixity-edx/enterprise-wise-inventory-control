import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'],
        required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    fromBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    toBranch: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    quantity: { type: Number, required: true },
    reason: { type: String },
    notes: { type: String },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Movement', movementSchema);
