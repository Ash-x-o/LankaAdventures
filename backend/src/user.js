const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
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


router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    const filename = req.file.filename; // single file
    res.json({
      message: "Image uploaded successfully",
      file: filename,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error uploading file" });
  }
});



const userSchema = new mongoose.Schema({
    userName: { type: String, required: true,},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: "" },
    role: { type: String, default: 'user' },
    isVerified: { type: Boolean, default: false },
    cardDetails: { type: [{
        nameOnCard: String,
        cardNumber: String,
        expiryDate: String,
        cvv: String
    }], default: [] },
    invoiceMail: { type: String, default: "" }
}, { timestamps: true});
const User = mongoose.model('User', userSchema, 'users');

// hash password before saving
userSchema.pre('save', async function (next) {
    try {

        if (!this.isModified('password')) return next();
        
        const salt = await bcrypt.genSalt(10);
        

        this.password = await bcrypt.hash(this.password, salt);
        
    } catch (error) {
        console.error(error);
        next(error);
    }
});


// routes
router.post('/register', async (req, res) => {
    try {
        
        const { userName, email, password } = req.body;

        if (await User.findOne({ email }))
            return res.status(400).json({ message: 'Email already exists' });
        
        const newUser = new User({ userName, email, password });
        await newUser.save();
        
        const token = jwt.sign(
            { id: newUser._id, role: newUser.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        res.cookie("lankaAdventureAuthToken", token, {
            httpOnly: true,       // JS can't read it → safer
            secure: process.env.NODE_ENV === "production",        // true ONLY if HTTPS
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
              
        });


        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        const token = jwt.sign(
            { id: user._id, role: user.role},
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("lankaAdventureAuthToken", token, {
          httpOnly: true, // JS can't read it → safer
          secure: process.env.NODE_ENV === "production", // true ONLY if HTTPS
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000, // one week
          path: "/",
        });


        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post("/logout", (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie("lankaAdventureAuthToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true ONLY if HTTPS
      sameSite: "lax",
      path: "/", // make sure it matches the cookie path
    });

    console.log("User logged out successfully.");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
});

router.get("/check-session", async (req, res) => {
  try {
    const token = req.cookies.lankaAdventureAuthToken;
    if (!token) return res.json({ loggedIn: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.json({ loggedIn: false});
    console.log("Session valid for user:", user.userName);

    res.json({ loggedIn: true, user });
  } catch (err) {
    console.error("Session check error:", err);
    res.json({ loggedIn: false });
  }
});

function authMiddleware(requiredRole) {
  return (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // attach user info
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

router.put('/update-account/:id', async (req, res) => {
  try{
    const {userName, email} = req.body;
    const userId = req.params.id;
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    user.userName = userName || user.userName;
    user.email = email || user.email;
    user.profileImg = req.body.profileImg || user.profileImg;
    await user.save();
    res.status(200).json({message: "Account updated successfully", user });
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.put('/update-password/:id', async (req, res) => {
  try{
    const {oldPassword, newPassword} = req.body;
    const userId = req.user.id;
    const user = await

    User.findById(userId)
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch){
      return res.status(400).json({message: "Old password is incorrect"});
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({message: "Password updated successfully"});
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.put('/update-cards/:id' , async (req, res) => {
  try{

    const cardDetails = req.body.cardDetails;
    console.log(cardDetails);
    const userId = req.body.userId;
    const user = await User.findById(userId)
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    user.cardDetails = Array.isArray(cardDetails) ? cardDetails : [cardDetails];

    await user.save();
    res.status(200).json({message: "Card details updated successfully", user });
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.put('/update-invoice-mail/:id' , async (req, res) => {
  try{
    const invoiceMail = req.body.invoiceMail;
    const userId = req.body.userId;
    const user = await
    User.findById(userId)
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    user.invoiceMail = invoiceMail;
    await user.save();
    res.status(200).json({message: "Invoice mail updated successfully", user });
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.get('/get-user-name-by/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({ userName: user.userName });
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.get('/get-user-by/:id', async (req, res) => {
  try{
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    res.status(200).json({ user });
  } catch (error){
    console.error(error);
    res.status(500).json({message: "Server error"});
  }
});

router.get('/all-reviewed-useres', async (req, res) => {
  try {
      const users = await User.find().select("-password");
      const safeUsers = users.map(user => ({
          _id: user._id,
          userName: user.userName,
          profileImg: user.profileImg,
      }));
      res.status(200).json({ users: safeUsers });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.delete("/delete-account/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;