require('dotenv').config();
const express = require('express');
// const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
// const { createProxyMiddleware } = require("http-proxy-middleware");
const path = require('path');

// import apis
const userApi = require('./user');
const destinationApi = require('./destinations');
const tourApi = require('./tours');
const customTourApi = require('./custom_tour');
const tourBookingApi = require('./tour_bookings');
const paymentApi = require('./payments');
const notificationApi = require('./notifications');
const reviewApi = require('./reviews');

app.set("trust proxy", 1);

// middleware
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT;
const HOST = process.env.LOCAL_HOST;
const MONGO_URI = process.env.MONGO_URI;

// use apis
app.use('/uploads', express.static('uploads'));

app.use('/api/users', userApi);
app.use('/api/destinations', destinationApi);
app.use('/api/tours', tourApi);
app.use('/api/custom-tours', customTourApi);
app.use('/api/tour-bookings', tourBookingApi);
app.use('/api/payments', paymentApi);
app.use('/api/notifications', notificationApi);
app.use('/api/reviews', reviewApi);


// app.get('/', (req, res) => {
//   res.send('🚀 Aperture Backend is running!');
// });

if (process.env.NODE_ENV === "production") {
  // Serve React build in production
  // React build

  app.use(express.static(path.join(__dirname, "../../frontend/build")));

  app.get("/*path", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/build", "index.html"));
  });
} else {
  // In development, proxy requests to running React dev server
  // For example, frontend is on port 3000
  const { createProxyMiddleware } = require("http-proxy-middleware");
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
    })
  );
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
// module.exports = app;
