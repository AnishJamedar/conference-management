const express = require('express');

const router = express.Router();
const Registration = require('../models/Registration');
const User = require('../models/User'); // Import the User model
const nodemailer = require('nodemailer');
const { client, paypal } = require('../config/paypalClient');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: 'in-v3.mailjet.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log information to console
});


// Ticket prices for PayPal orders
const ticketPrices = {
  general: '99.00',
  vip: '199.00',
  student: '49.00',
};

// Registration Endpoint
router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('ticketType').isIn(['general', 'vip', 'student']).withMessage('Invalid ticket type'),
    body('expertise').optional().isString().withMessage('Expertise must be a string'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, ticketType, expertise } = req.body;
    console.log(req.body);

    try {
      // Create registration entry in the database
      const registration = await Registration.create({
        name,
        email,
        ticket_type: ticketType,
        expertise,
        payment_status: 'Pending',
      });

      // Send confirmation email
      const mailOptions = {
        from: '"Confio Conference" <samyakjain720@gmail.com>',
        to: email,
        subject: 'Conference Registration Confirmation',
        text: `Hello ${name},\n\nThank you for registering for the conference with a ${ticketType} ticket. Please complete the payment to secure your spot.\n\nBest Regards,\nConfio Conference Team`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending email:', err);
          return res.status(500).json({ error: 'Failed to send confirmation email' });
        }
        console.log('Email sent:', info.response);
      });

      res.status(201).json({ message: 'Registration successful', registration });
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ error: 'Failed to register' });
    }
  }
);

// Create PayPal Order Endpoint
router.post('/create-paypal-order', async (req, res) => {
  const { registrationId, ticketType } = req.body;

  try {
    // Validate ticket type
    if (!ticketPrices[ticketType]) {
      return res.status(400).json({ error: 'Invalid ticket type' });
    }

    // Prepare PayPal order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: ticketPrices[ticketType],
          },
          description: `Confio 2024 Ticket - ${ticketType.charAt(0).toUpperCase() + ticketType.slice(1)}`,
        },
      ],
    });

    // Execute PayPal order creation
    const order = await client.execute(request);

    res.status(201).json({ id: order.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// Capture PayPal Order Endpoint
router.post('/capture-paypal-order', async (req, res) => {
  const { orderId, registrationId } = req.body;

  try {
    // Validate inputs
    if (!orderId || !registrationId) {
      return res.status(400).json({ error: 'Order ID and Registration ID are required' });
    }

    // Prepare PayPal capture request
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    // Execute PayPal order capture
    const capture = await client.execute(request);

    if (capture.result.status === 'COMPLETED') {
      // Fetch the registration entry from the database
      const registration = await Registration.findByPk(registrationId);
      if (!registration) {
        return res.status(404).json({ error: 'Registration not found' });
      }

      // Update registration payment status to 'Paid'
      registration.payment_status = 'Paid';
      await registration.save();

      // Send a confirmation email after payment is successful
      const mailOptions = {
        from: '"Confio Conference" <samyakjain720@gmail.com>',
        to: registration.email,
        subject: 'Payment Confirmation - Confio Conference',
        text: `Dear ${registration.name},\n\nThank you for completing the payment for your ${registration.ticket_type} ticket. Your registration is now confirmed!\n\nWe look forward to seeing you at the conference.\n\nBest Regards,\nConfio Conference Team`,
      };

      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.error('Error sending payment confirmation email:', err);
        } else {
          console.log('Payment confirmation email sent:', info.response);
        }
      });

      // Add the user to the `users` table if not already present
      const existingUser = await User.findOne({ where: { email: registration.email } });
      if (!existingUser) {
        const newUser = await User.create({
          username: registration.name, // Assuming `name` is the username
          email: registration.email,
          password: 'default-password', // Replace this with a secure password or onboarding flow
          role: 'user', // Default role
          expertise: registration.expertise,
        });

        console.log('User created:', newUser);
      } else {
        console.log('User already exists in users table.');
      }

      res.status(200).json({ message: 'Payment successful and user added to users table', capture });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: 'Failed to capture PayPal order' });
  }
});

module.exports = router;
