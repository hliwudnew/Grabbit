require('dotenv').config();

const express = require('express');
const path = require('path');
const fetch = require('node-fetch'); // Ensure you have installed node-fetch (npm install node-fetch)
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(express.static('public'));

const cors = require("cors");
app.use(cors());

// --- Endpoint to create a Stripe Connect account for a new seller ---
app.post("/api/account-connect", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'CA',
      email: req.body.email,
      // You can adjust the fields below as needed
      capabilities: { transfers: { requested: true } },
    });
    console.log("Connected account ID:", account.id);
    res.json({ account: account.id });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Endpoint to generate an onboarding link for the seller ---
app.post("/api/account-link", async (req, res) => {
  try {
    const { account } = req.body;
    const accountLink = await stripe.accountLinks.create({
      account: account,
      return_url: `${process.env.SERVER_URL}/index.html`,
      refresh_url: `${process.env.SERVER_URL}/index.html`,
      type: "account_onboarding",
    });
    res.json(accountLink);
  } catch (error) {
    console.error("Error creating account link:", error);
    res.status(500).json({ error: error.message });
  }
});

// --- Endpoint for successful payment page ---
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

// --- Seller Revenue Dashboard Endpoint (for internal use) ---
app.post('/api/payment-dashboard', async (req, res) => {
  try {
    // Replace PLATFORM_STRIPE_ACCOUNT with your platform's account ID if needed.
    const loginLink = await stripe.accounts.createLoginLink(process.env.PLATFORM_STRIPE_ACCOUNT);
    res.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link:", error);
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
            unit_amount: Number(price) * 100, // Convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&itemId=${itemId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      metadata: {
        itemId: itemId, // so we know which item was purchased in the webhook
      },
    };

    // Retrieve the connected account details to check if it's fully onboarded.
    const connectedAccount = await stripe.accounts.retrieve(sellerAccount);
    console.log("Connected account details:", connectedAccount);

    // If the seller’s account is not the same as your platform and is fully onboarded, add transfer data.
    if (sellerAccount !== process.env.PLATFORM_STRIPE_ACCOUNT && connectedAccount.details_submitted) {
      sessionParams.payment_intent_data = {
        application_fee_amount: Math.round(Number(price) * 0.10 * 100), // 10% fee (in cents)
        transfer_data: {
          destination: sellerAccount,
        },
      };
    } else {
      console.log("Either seller account equals platform account or not fully onboarded; no transfer_data will be added.");
    }

    // IMPORTANT: Do not pass the `stripeAccount` option here because that would create the charge on behalf of the seller.
    // Instead, create the session on your platform account.
    const session = await stripe.checkout.sessions.create(sessionParams);
    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});


// --- Webhook endpoint for checkout session events ---
// This endpoint listens for webhook events from Stripe to, for example, mark an item as purchased.
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
      // For example, using node-fetch to call your item service endpoint:
      fetch(`http://localhost:5003/api/items/${itemId}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include auth headers if required for internal communication
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

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log('Payment service listening on port ' + PORT + '...');
});