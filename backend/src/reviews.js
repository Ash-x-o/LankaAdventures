const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourBooking', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId,refPath: 'refModel', required: true },
    refModel: {
        type: String,
        required: true,
        enum: ['Tour', 'CustomTour']
    },
    planType: { type: String, required: true , default: "package" }, // e.g., "Basic", "Premium"
    rating: { type: Number, required: true, min: 1, max: 5 },
    reviewText: { type: String, default: "" },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema , 'reviews');

//routes
router.post('/add-review', async (req, res) => {
    try {
        const { userId, bookingId, planId, refModel, planType, rating, reviewText } = req.body;
        const newReview = new Review({ userId, bookingId, planId, refModel, planType, rating, reviewText });
        await newReview.save();
        
        res.status(201).json({ message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all-reviews', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/reviews-by-plan/:planId', async (req, res) => {
    try {
        const { planId } = req.params;
        const reviews = await Review.find({ planId });
        res.status(200).json({ reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;