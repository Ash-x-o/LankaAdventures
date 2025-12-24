const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage settings
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    let original = file.originalname.toLowerCase();

    // replace spaces with underscores
    original = original.replace(/\s+/g, "_");

    // add timestamp to avoid duplicates
    // const uniqueName = Date.now() + "_" + original;

    cb(null, original);
  }
});

const upload = multer({ storage: storage });

const tourSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, default: "N/A" },
    overview: { type: String, default: "N/A" },
    
    price: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    coverIndex: { type: Number, default: 0 },
    maxGroupSize: { type: Number, default: 1 },
    minGroupSize: { type: Number, default: 1 },
    destinations: { type: [mongoose.Schema.Types.ObjectId], ref: 'Destination'},

    dailyPlan: {
        type: [{
            actTitle:String,
            actDescription:String
        }], default: [{}] },
    includes: { type: [String], default: [] },
    excludes: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    status: { type: String, default: 'Archived' },
    isFeatured: { type: Boolean, default: false },
    reviews: { type: [{ userId: mongoose.Schema.Types.ObjectId, review: String , rating: Number }], default: [] },
    purchasesCount: { type: Number, default: 0 }
}, { timestamps: true });

const Tour = mongoose.model('Tour', tourSchema, 'tours');

// routes
router.post("/upload-images",upload.array("images", 10),(req, res) => {
    try {
      const filenames = req.files.map(file => file.filename);
      res.json({
        message: "Images uploaded successfully",
        files: filenames
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Error uploading files" });
    }
  }
);

router.get('/category-list', async (req, res) => {
    try {
        const categories = await Tour.distinct('categories');
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/create-package', async (req, res) => {
    try {
        const tourData = req.body;
        const newTour = new Tour(tourData);
        await newTour.save();
        res.status(201).json({ message: 'Tour package created successfully', tourId: newTour._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-package/:id', async (req, res) => {
    try {
        const tourId = req.params.id;
        const tourData = req.body;
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        Object.assign(tour, tourData);
        await tour.save();
        res.status(200).json({ message: 'Tour package updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/save-draft', async (req, res) => {
    try {
        const tourData = req.body;
        const newTour = new Tour(tourData);
        await newTour.save();
        res.status(201).json({ message: 'Draft saved successfully', tourId: newTour._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-all', async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).json({ tours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/update-status/:id', async (req, res) => {
    try {
        const tourId = req.params.id;
        const { status } = req.body;
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        tour.status = status;
        await tour.save();
        res.status(200).json({ message: 'Tour status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete-multiple', async (req, res) => {
    try {
        const { tourIds } = req.body;
        await Tour.deleteMany({ _id: { $in: tourIds } });
        res.status(200).json({ message: 'Tours deleted successfully' });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.delete('/delete-by/:id', async (req, res) => {
    try {
        const tourId = req.params.id;
        await Tour.findByIdAndDelete(tourId);
        res.status(200).json({ message: 'Tour deleted successfully' });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
router.delete('/delete-all', async (req, res) => {
    try {
        await Tour.deleteMany({});
        res.status(200).json({ message: 'All tours deleted successfully' });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all-published', async (req, res) => {
    try {
        const tours = await Tour.find({ status: 'Published' });
        res.status(200).json({ tours });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-tour-by/:id', async (req, res) => {
    try {
        const tourId = req.params.id;
        const tour = await Tour.findById(tourId).populate('destinations');
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }
        res.status(200).json({ tour });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router