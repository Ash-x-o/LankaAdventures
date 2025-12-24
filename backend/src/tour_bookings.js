const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const tourBookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, refPath: 'refModel', required: true },
    refModel: {
        type: String,
        required: true,
        enum: ['Tour', 'CustomTour']
    },
    planType: { type: String, required: true , default: "package" }, // e.g., "Basic", "Premium"
    planDate: { type: Date, default: null },
    status: { type: String, default: 'Pending' },
    groupSize: { type: Number, default: 0 }, // Number of people in the group
    changeRequests:{
        type: [{ responded: Boolean, details: String }], default: []
    },
    bookedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewAdded: { type: Boolean, default: false }

}, { timestamps: true });

const TourBooking = mongoose.model('TourBooking', tourBookingSchema, 'tour_bookings');

router.post('/book-tour', async (req, res) => {
    try {
        const { userId, planId, refModel, planType, planDate, groupSize, bookedAdmin, status  } = req.body;
        const newBooking = new TourBooking({ userId, planId, refModel, planType, planDate, status , groupSize, changeRequests: [], bookedAdmin });
        await newBooking.save();
        res.status(201).json({ message: 'Tour booked successfully', booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/bookings-by-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bookings = await TourBooking.find({ userId: id }).populate('planId');
        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all-bookings', async (req, res) => {
    try {
        const bookings = await TourBooking.find().populate('planId').populate('userId');
        res.status(200).json({ bookings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-booking-status/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if(status === "Payment Done"){
            const tourPkg = await TourBooking.findById(id).populate('planId');
            if(tourPkg && tourPkg.planId){
                const Tour = mongoose.model('Tour');
                await Tour.findByIdAndUpdate(tourPkg.planId._id, { $inc: { purchasesCount: 1 } });
            }
        }
        const booking = await TourBooking.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-booking-by/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await TourBooking.findById(id).populate('planId').populate('userId');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-change-request/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { changeRequests } = req.body;
        const booking = await TourBooking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        booking.changeRequests = changeRequests;
        await booking.save();
        res.status(200).json({ message: 'Change requests updated', booking });
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.put('/update-booking/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const booking = await TourBooking.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'Booking updated successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/mark-review-added/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await TourBooking.findByIdAndUpdate(id, { reviewAdded: true }, { new: true });

        res.status(200).json({ message: 'Booking marked as review added', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;