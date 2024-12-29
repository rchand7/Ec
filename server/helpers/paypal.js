require("dotenv").config(); // Load environment variables
const paypal = require("paypal-rest-sdk"); // Import PayPal SDK

// Log the environment variables to check if they are being loaded correctly
console.log('PAYPAL_MODE:', process.env.PAYPAL_MODE);
console.log('PAYPAL_CLIENT_ID:', process.env.PAYPAL_CLIENT_ID);
console.log('PAYPAL_CLIENT_SECRET:', process.env.PAYPAL_CLIENT_SECRET);

// Configure PayPal SDK
paypal.configure({
  mode: process.env.PAYPAL_MODE, // Use environment variable for mode ("sandbox" or "live")
  client_id: process.env.PAYPAL_CLIENT_ID, // PayPal Client ID from environment
  client_secret: process.env.PAYPAL_CLIENT_SECRET, // PayPal Client Secret from environment
});

module.exports = paypal; // Export PayPal SDK configuration
