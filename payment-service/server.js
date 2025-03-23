// payment-service/server.js
require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Ensure node-fetch is installed (npm i node-fetch)
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const app = express(); // <-- Make sure this is declared before any app.use() calls

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Create a Stripe Account For User
app.post("/api/account-connect", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      country: 'CA',
      email: req.body.email,
      controller: {
        stripe_dashboard: { type: "express" },
        fees: { payer: "application" },
        losses: { payments: "application" },
      },
      capabilities: { transfers: { requested: true } },
    });
    console.log("Connected account ID:", account.id);
    res.json({ account: account.id });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    res.status(500).json({ error: error.message });
  }
});

// Onboard User Stripe Account – create an account link for express onboarding
app.post("/api/account-link", async (req, res) => {
  try {
    const { account } = req.body;
    if (!account) {
      throw new Error("Connected account ID is required");
    }
    const accountLink = await stripe.accountLinks.create({
      account: account,
      return_url: `${process.env.CLIENT_URL}/onboarding-success`,
      refresh_url: `${process.env.CLIENT_URL}/onboarding-failed`,
      type: "account_onboarding",
    });
    console.log("Stripe account link created:", accountLink.url);
    res.json(accountLink);
  } catch (error) {
    console.error("Error creating account link:", error);
    res.status(500).json({ error: error.message });
  }
});

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
      metadata: { itemId: itemId },
    };

    // Only add transfer_data if sellerAccount is not the platform account.
    if (sellerAccount !== process.env.PLATFORM_STRIPE_ACCOUNT) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(Number(price) * 0.10 * 100), // 10% fee in cents
        transfer_data: { destination: sellerAccount },
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

// Webhook endpoint (needs raw body)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout Session completed:', session);

    // Get the itemId from session metadata and mark the item as purchased
    const itemId = session.metadata.itemId;
    if (itemId) {
      fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

// Success endpoint to retrieve session details
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
app.listen(PORT, () => console.log('Payment service listening on port ' + PORT + '...'));