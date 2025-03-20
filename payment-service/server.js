require('dotenv').config()

const express = require('express')
const path = require('path');
const app = express()
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.use(express.json())
app.use(express.static('public'))

const cors = require("cors");
app.use(cors());

// Create a Stripe Account For User
app.post("/api/account-connect", async (req, res) => {
  try {
    const account = await stripe.accounts.create({
      country: 'CA',
      email: req.body.email,
      controller: {
        stripe_dashboard: {
          type: "express",
        },
        fees: {
          payer: "application"
        },
        losses: {
          payments: "application"
        },
      },
      capabilities: {
        transfers: { requested: true },
      },
    });
    console.log(account.id);
    res.json({
      account: account.id,
    });
  } catch (error) {
    console.error(
      "An error occurred when calling the Stripe API to create an account. Error:",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
});

// Onboard User Stripe Account, Connect To Grabbit's Stripe Platform Account
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
    console.error(
      "An error occurred when calling the Stripe API to create an account link:",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
});

// Successful Payment Page
app.get('/api/success', async (req, res) => {

  const session = await stripe.checkout.sessions.retrieve(req.query.session_id)
  console.log(session);
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
  return;

})

// Seller Revenue Dashboard
app.post('/api/payment-dashboard', async (req, res) => {

  const loginLink = await stripe.accounts.createLoginLink('acct_1R0EMhFWFoWYGzJM')
  res.json({ url: loginLink.url });

});

// Stripe Checkout Page
app.post('/api/checkout-session', async (req, res) => {

  try {

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: req.body.title,
            },
            unit_amount: req.body.price * 100, // In cents
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: req.body.price * 0.10, // 10% in fees that Grabbit earns per purchase
        transfer_data: {
          destination: 'acct_1R0EMhFWFoWYGzJM',
        },
      },
      mode: 'payment',
      success_url: `${process.env.SERVER_URL}/success?&session_id={CHECKOUT_SESSION_ID}`,
    });

    res.json({ url: session.url});
    
  } catch (error) {
    res.status(500).json({error: error.message});
  }


});

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log('Listening on port ' + PORT + '...');
})