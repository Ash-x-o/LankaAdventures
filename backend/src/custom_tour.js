const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const customTourSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tourName: { type: String, required: true },
    dailyPlan: {
        type: [[{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }]],
        default: [[]]
    },
    budget: { type: Number, default: 0 },
    specialRequests: { type: String, default: "N/A" },
    
}, { timestamps: true });

router.post('/create-custom-tour', async (req, res) => {
    try {
        const { userId, tourName,  dailyPlan, budget, specialRequests } = req.body;
        const newCustomTour = new CustomTour({ userId, tourName, dailyPlan, budget, specialRequests });
        await newCustomTour.save();
        res.status(201).json({ message: 'Custom tour request created successfully', customTour: newCustomTour });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/tours-by-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customTours = await CustomTour.find({ userId: id }).populate('dailyPlan');
        res.status(200).json({ customTours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
const CustomTour = mongoose.model('CustomTour', customTourSchema, 'custom_tours');

router.get('/tour-by/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const customTour = await CustomTour.findById(id).populate('dailyPlan');
        res.status(200).json({ customTour });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all-custom-tours', async (req, res) => {
    try {
        const customTours = await CustomTour.find().populate('dailyPlan').populate('userId');
        res.status(200).json({ customTours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-custom-tour/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const customTour = await CustomTour.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'Custom tour updated successfully', customTour });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;