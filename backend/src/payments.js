const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourBooking', required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    cardId: { type: String, default: '' },
    transactionId: { type: String, default: '' }
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema, 'payments');

router.post('/make-payment', async (req, res) => {
    try {
        const { userId, bookingId, amount, paymentMethod, status, transactionId } = req.body;
        const newPayment = new Payment({ userId, bookingId, amount, paymentMethod, status, transactionId });
        await newPayment.save();
        res.status(201).json({ message: 'Payment created successfully', payment: newPayment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/payments-by-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payments = await Payment.find({ userId: id }).populate('bookingId');
        res.status(200).json({ payments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/payment-by/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findById(id).populate('bookingId');
        res.status(200).json({ payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-payment/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: 'Payment updated successfully', payment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;