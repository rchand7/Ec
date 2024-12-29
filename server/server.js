require('dotenv').config();  // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const paypal = require('paypal-rest-sdk');  // Import PayPal SDK

// PayPal configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE || 'sandbox',  // Sandbox or live mode
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});

// Log environment variable for debugging
console.log('MONGO_URI:', process.env.MONGO_URI);

// Create a database connection
mongoose
  .connect(process.env.MONGO_URI) // Use the environment variable for Mongo URI
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB connection error:", error));

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Use environment variable or fallback to localhost for dev
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true, // Allow cookies
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/common/feature", commonFeatureRouter);

// PayPal Routes
app.post("/api/paypal/payment", (req, res) => {
  const paymentData = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    redirect_urls: {
      return_url: 'http://localhost:5000/api/paypal/success',
      cancel_url: 'http://localhost:5000/api/paypal/cancel',
    },
    transactions: [{
      amount: {
        total: req.body.amount,  // Amount to be charged
        currency: 'USD',
      },
      description: 'Your purchase description',
    }],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === 'approval_url') {
          res.json({ approval_url: payment.links[i].href });
        }
      }
    }
  });
});

// Success Route
app.get("/api/paypal/success", (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;

  const executePaymentData = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, executePaymentData, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
    } else {
      res.json({ message: 'Payment successful!', payment });
    }
  });
});

// Cancel Route
app.get("/api/paypal/cancel", (req, res) => {
  res.status(200).send('Payment cancelled');
});

// Preflight handling (for OPTIONS requests)
app.options('*', cors());  // Allow preflight requests for all routes

// Serve static files for production (client build folder)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/dist")));
  app.get("*", (_, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "dist", "index.html"));
  });
}

// Start server
app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
