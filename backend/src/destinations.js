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


const destinationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    summary: { type: String, default: "N/A" },
    region: { type: String, default: "N/A" },
    description: { type: String, default: "N/A" },
    location: {   // <-- MUST EXIST
      lat: Number,
      lon: Number,
      shortName: { type: String, default: "N/A" },
      fullAddress: { type: String, default: "N/A" }
    },
    images: { type: [String], default: [] },
    coverIndex: { type: Number, default: 0 },
    categories: { type: [String], default: [] },
    exploreTime: { type: Number, default: 0 }, // in hours
    bestTimeToVisit: { type: String, default: "N/A" },
    learnAbout: { type: String, default: "N/A" },
    thingsToDo: { type: String, default: "N/A" },
    localTips: { type: String, default: "N/A" },
    status: { type: String, default: 'Draft' },
    
    
}, { timestamps: true });

const Destination = mongoose.model('Destination', destinationSchema, 'destinations');

// routes
router.post('/add', async (req, res) => {
    try {
        const { name, summary, region, description, location, images, coverIndex, categories, status } = req.body;
        const newDestination = new Destination({ name, summary, region, description, location, images, coverIndex, categories, status });
        await newDestination.save();
        res.status(201).json({ message: 'Destination added successfully', destination: newDestination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


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

router.post("/save-draft", async (req, res) => {
  console.log(req.body);
    try {
        const { name, summary, region, description, location, images, coverIndex , categories, status } = req.body;
        const draftDestination = new Destination({ 
          name,
          summary: summary || "N/A",
          region: region || "N/A",
          description: description || "N/A",
          location: location || { lat: 0, lon: 0, shortName: "N/A", fullAddress: "N/A" },
          images: images || [],
          coverIndex: coverIndex || 0,
          categories: categories || [],
          status: status || 'Draft'
        });
        await draftDestination.save();
        res.status(201).json({ message: 'Draft saved successfully', destination: draftDestination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/region-list', async (req, res) => {
    try {
        const regions = await Destination.distinct('region');
        res.status(200).json({ regions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all', async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ createdAt: -1 });
        res.status(200).json({ destinations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/category-list', async (req, res) => {
    try {
        const categories = await Destination.distinct('categories');
        res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/update-draft/:id', async (req, res) => {
    try {
      console.log(req.body.name);
        const destinationId = req.params.id;
        const updateData = req.body;
        const updatedDestination = await Destination.findByIdAndUpdate(destinationId, updateData, { new: true });
        if (!updatedDestination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.status(200).json({ message: 'Destination updated successfully', destination: updatedDestination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const destinationId = req.params.id;
        const deletedDestination = await Destination.findByIdAndDelete(destinationId);
        if (!deletedDestination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.status(200).json({ message: 'Destination deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete-multiple', async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs in the request body
        const result = await Destination.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} destinations deleted successfully` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/get-by/:id', async (req, res) => {
    try {
        const destinationId = req.params.id;
        const destination = await Destination.findById(destinationId);
        if (!destination) {
            return res.status(404).json({ message: 'Destination not found' });
        }
        res.status(200).json({ destination });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/all-published', async (req, res) => {
    try {
        const destinations = await Destination.find({ status: 'Published' }).sort({ createdAt: -1 });
        res.status(200).json({ destinations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/delete-all', async (req, res) => {
    try {
        await Destination.deleteMany({});
        res.status(200).json({ message: 'All destinations deleted successfully' });
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
