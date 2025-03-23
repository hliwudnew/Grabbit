// Payment Service: server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Install node-fetch if not already installed (npm i node-fetch)
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(express.static('public'));

const cors = require("cors");
app.use(cors());

// ----- Your existing endpoints here -----
// (account-connect, account-link, success, payment-dashboard, checkout-session, etc.)

// Stripe Checkout Session endpoint
app.post('/api/checkout-session', async (req, res) => {
  try {
    const { title, price, itemId, sellerAccount } = req.body;
    if (!sellerAccount) {
      throw new Error("sellerAccount is missing from request");
    }
    
    const sessionParams = {
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: title },
            unit_amount: Number(price) * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&itemId=${itemId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      metadata: {
        itemId: itemId, // Include item id in metadata so we can use it in the webhook
      },
    };

    // Only add transfer_data if sellerAccount is not the platform account.
    if (sellerAccount !== process.env.PLATFORM_STRIPE_ACCOUNT) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(Number(price) * 0.10 * 100), // 10% fee in cents
        transfer_data: {
          destination: sellerAccount,
        },
      };
    } else {
      console.log("Seller account is the same as the platform account; transfer_data will not be added.");
    }

    const options = {};
    if (sellerAccount !== process.env.PLATFORM_STRIPE_ACCOUNT) {
      options.stripeAccount = sellerAccount;
    }

    const session = await stripe.checkout.sessions.create(sessionParams, options);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// ----- Add the webhook endpoint below -----

// IMPORTANT: The webhook endpoint needs the raw request body, so use express.raw middleware.
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout Session completed:', session);

    // Get the itemId from session metadata
    const itemId = session.metadata.itemId;
    if (itemId) {
      // Call your item service to mark the item as purchased.
      // (This example uses fetch; ensure your item service is reachable from here.)
      fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Optionally, you might include an authorization header if needed for internal calls.
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to mark item as purchased');
          }
          return response.json();
        })
        .then(data => {
          console.log('Item marked as purchased via webhook:', data);
        })
        .catch(error => {
          console.error('Error marking item as purchased via webhook:', error);
        });
    } else {
      console.error("No itemId found in session metadata");
    }
  }

  res.json({ received: true });
});

app.get('/api/success', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log("Checkout session:", session);
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
  } catch (error) {
    console.error("Error retrieving checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log('Payment service listening on port ' + PORT + '...');
});