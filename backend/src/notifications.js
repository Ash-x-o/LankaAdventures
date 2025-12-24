const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User',},
    type: { type: String, default: 'general' },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    date: { type: Date,  },
    forAdmin: { type: Boolean, default: false }
}, { timestamps: true });
const Notification = mongoose.model('Notification', notificationSchema, 'notifications');

// routes
router.post('/add-notification', async (req, res) => {
    try {
        const { userId, type, message, date } = req.body;
        const newNotification = new Notification({ userId, type, message, date });
        await newNotification.save();
        res.status(201).json({ message: 'Notification added successfully', notification: newNotification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/notifications-by-user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notifications = await Notification.find({ userId: id }).sort({ createdAt: -1 });
        res.status(200).json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/mark-as-read/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/mark-all-as-read/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const result = await Notification.updateMany({ userId }, { isRead: true });
        res.status(200).json({ message: 'All notifications marked as read', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;