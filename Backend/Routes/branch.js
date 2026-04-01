import express from 'express';
import Branch from '../models/Branch.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all branches
router.get('/', auth, async (req, res) => {
    try {
        const branches = await Branch.find().populate('manager', 'name email');
        res.json(branches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get single branch
router.get('/:id', auth, async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id).populate('manager', 'name email');
        if (!branch) {
            return res.status(404).json({ msg: 'Branch not found' });
        }
        res.json(branch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a branch
router.post('/', auth, async (req, res) => {
    const { name, location, address, phone } = req.body;
    try {
        const newBranch = new Branch({
            name,
            location,
            address,
            phone
        });

        const branch = await newBranch.save();
        res.json(branch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Update branch
router.put('/:id', auth, async (req, res) => {
    const { name, location, address, phone, status } = req.body;
    try {
        let branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ msg: 'Branch not found' });
        }

        branch.name = name || branch.name;
        branch.location = location || branch.location;
        branch.address = address || branch.address;
        branch.phone = phone || branch.phone;
        branch.status = status || branch.status;

        await branch.save();
        res.json(branch);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete branch
router.delete('/:id', auth, async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ msg: 'Branch not found' });
        }

        await Branch.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Branch removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
