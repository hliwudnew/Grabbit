// Payment Service: server.js
require('dotenv').config();
const express = require('express');
const path = require('path');
// Use dynamic import for node-fetch in CommonJS:
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// --- Your existing endpoints ---

// Stripe Checkout Session endpoint
app.post('/api/checkout-session', async (req, res) => {
  try {
    const { title, price, itemId, sellerAccount } = req.body;
    if (!sellerAccount) {
      throw new Error("sellerAccount is missing from request");
    }
    
    console.log("Checkout-session request:");
    console.log("  Seller Account:", sellerAccount);
    console.log("  Platform Account:", process.env.PLATFORM_STRIPE_ACCOUNT);

    // Build session parameters
    const sessionParams = {
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: title },
            unit_amount: Number(price) * 100, // dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&itemId=${itemId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      metadata: { itemId: itemId },
    };

    // Retrieve connected account details
    const connectedAccount = await stripe.accounts.retrieve(sellerAccount);
    console.log("Connected account details:", connectedAccount);

    // Add transfer_data if the seller's account is not the platform account and is fully onboarded.
    if (sellerAccount !== process.env.PLATFORM_STRIPE_ACCOUNT && connectedAccount.details_submitted) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(Number(price) * 0.10 * 100),
        transfer_data: { destination: sellerAccount },
      };
    } else {
      console.log("Either seller account equals platform account or not fully onboarded; no transfer_data will be added.");
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint (raw body needed)
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout Session completed:', session);
    const itemId = session.metadata.itemId;
    if (itemId) {
      // Call item service endpoint to mark the item as purchased.
      fetch(`http://localhost:5003/api/items/${itemId}/webhookPurchase`, {
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

// Other endpoints (account-connect, account-link, etc.) go here

app.get('/api/success', async (req, res) => {
  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    console.log("Checkout session:", session);
    
    // Get the item ID from session metadata
    const itemId = session.metadata.itemId;
    if (itemId) {
      // Call the item service to mark the item as purchased
      const response = await fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        // Log error if the purchase update fails.
        const errorData = await response.json();
        console.error('Failed to mark item as purchased:', errorData);
      } else {
        const data = await response.json();
        console.log('Item marked as purchased via success endpoint:', data);
      }
    } else {
      console.error("No itemId found in session metadata");
    }
    
    // Finally, send the success page to the client
    res.sendFile(path.join(__dirname, 'public', 'success.html'));
  } catch (error) {
    console.error("Error in success endpoint:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment-dashboard', async (req, res) => {
  try {
    const loginLink = await stripe.accounts.createLoginLink(process.env.PLATFORM_STRIPE_ACCOUNT);
    res.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log('Payment service listening on port ' + PORT + '...');
});