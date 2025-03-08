require('dotenv').config()

const express = require('express')
const path = require('path');
const app = express()

app.use(express.json())
app.use(express.static('public'))


const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post('/payment-dashboard', async (req, res) => {

  //const loginLink = await stripe.accounts.createLoginLink('{{CONNECTED_ACCOUNT_ID}}')
  const loginLink = await stripe.accounts.createLoginLink('acct_1R0EMhFWFoWYGzJM')

  res.json({ url: loginLink.url });

});

app.post("/account-connect", async (req, res) => {
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
      "An error occurred when calling the Stripe API to create an account",
      error
    );
    res.status(500);
    res.send({ error: error.message });
  }
});


app.post("/account_link", async (req, res) => {
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

app.get('/success', async (req, res) => {

  const session = await stripe.checkout.sessions.retrieve(req.query.session_id)
  console.log(session);
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
  return;

})

app.post('/checkout-session', async (req, res) => {

  try {

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 1000,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: 123, // switch to cost*percentage
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

app.listen(3000, () => {
  console.log('Listening on port 3000...');
})