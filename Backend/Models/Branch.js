import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);
