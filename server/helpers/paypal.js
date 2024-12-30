const paypal = require("paypal-rest-sdk"); // Import PayPal SDK

// Log the PayPal configuration details
console.log('PAYPAL_MODE: sandbox');
console.log('PAYPAL_CLIENT_ID: AfixF2u6YvdBL-ZbWY1DhbQmFAsO4mSLUZmr5DaE3CVbMu8oh8DYc7jRytPs9_A-RHEBtu3beVRqChPI');
console.log('PAYPAL_CLIENT_SECRET: EMsrMg0CufBOjwlTIDNKhieTs2BMbk5MW0v4lMfw02Q7HZ7whupvQ0CJ5gcuDMv7_2KHXRcqz5g5ssTd');

// Configure PayPal SDK with hard-coded values
paypal.configure({
  mode: 'sandbox', // Use sandbox mode for testing, or 'live' for production
  client_id: 'AfixF2u6YvdBL-ZbWY1DhbQmFAsO4mSLUZmr5DaE3CVbMu8oh8DYc7jRytPs9_A-RHEBtu3beVRqChPI', // PayPal Client ID
  client_secret: 'EMsrMg0CufBOjwlTIDNKhieTs2BMbk5MW0v4lMfw02Q7HZ7whupvQ0CJ5gcuDMv7_2KHXRcqz5g5ssTd', // PayPal Client Secret
});

module.exports = paypal; // Export PayPal SDK configuration
