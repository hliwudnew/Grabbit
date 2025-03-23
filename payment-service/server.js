require('dotenv').config();

const express = require('express');
const path = require('path');
const app = express();
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

app.use(express.json());
app.use(express.static('public'));

const cors = require("cors");
app.use(cors());

// ------------------------------
// Account creation and onboarding
// ------------------------------

// Create a Stripe Connect account for a new user
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
      type: 'express'
    });
    console.log("Connected account ID:", account.id);
    res.json({ account: account.id });
  } catch (error) {
    console.error("Error creating Stripe account:", error);
    res.status(500).json({ error: error.message });
  }
});


// endpoint after you have saved the connected account ID in your database.)
app.post("/api/account-link", async (req, res) => {
  try {
    const { accountId } = req.body; // Pass the connected account ID from your database
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.CLIENT_URL}/reauth`, 
      return_url: `${process.env.CLIENT_URL}/dashboard`, 
      type: "account_onboarding",
    });
    res.json({ url: accountLink.url });
  } catch (error) {
    console.error("Error creating account link:", error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------------
// Payment and Checkout
// ------------------------------

// Successful Payment Page (for redirect after checkout)
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

// Seller Revenue Dashboard (for accessing the seller’s Stripe dashboard)
app.post('/api/payment-dashboard', async (req, res) => {
  try {
    const loginLink = await stripe.accounts.createLoginLink(process.env.PLATFORM_STRIPE_ACCOUNT);
    res.json({ url: loginLink.url });
  } catch (error) {
    console.error("Error creating login link:", error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe Checkout Session creation
app.post('/api/checkout-session', async (req, res) => {
  try {
    const { title, price, itemId, sellerAccount } = req.body;
    if (!sellerAccount) {
      throw new Error("sellerAccount is missing from request");
    }
    
    // Build the session parameters, and add metadata to pass the item ID
    const sessionParams = {
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: { name: title },
            unit_amount: Number(price) * 100, // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&itemId=${itemId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`,
      metadata: {
        itemId: itemId  // Save item ID so the webhook can use it
      }
    };

    // Only include transfer_data and application_fee_amount if seller is not your platform account
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

// ----- Add the Webhook Endpoint ----- //
// IMPORTANT: Stripe requires the raw body for webhook verification.
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log('Checkout session completed:', session);
    const itemId = session.metadata.itemId;
    if (itemId) {
      try {
        // Mark the item as purchased in the database
        const Item = require('./models/item');
        await Item.findByIdAndUpdate(itemId, { purchased: true });
        console.log(`Item ${itemId} marked as purchased.`);
      } catch (updateError) {
        console.error(`Error updating item ${itemId}:`, updateError.message);
      }
    }
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log('Payment service listening on port ' + PORT + '...');
});