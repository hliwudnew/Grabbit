require('dotenv').config()

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.static('public'))

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

// sample items from inventory
const storeItems = new Map([
  [1, { priceCents: 10000, name: "OOP" }],
  [2, { priceCents: 20000, name: "CSS" }],
])

app.post('/checkout-session', async (req, res) => {

  try {

    const session = await stripe.checkout.sessions.create({

      payment_method_types: ['card'],
      mode: 'payment',
      invoice_creation: {
        enabled: true
      },
      line_items: req.body.items.map(item =>{
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: 'cad',
            product_data: {
              name: storeItem.name
            },
            unit_amount: storeItem.priceCents
          },
          quantity: item.quantity
        }
      }),
      shipping_address_collection: {
        allowed_countries: ['US', 'CA']
      },
      success_url: `${process.env.SERVER_URL}/success?&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.SERVER_URL}/cancel.html`

    });

    res.json({ url: session.url }) // re-direct to stripe payment page
    
  } catch (error) {
    res.status(500).json({error: error.message});
  }


});

app.get('/success', async (req, res) => {

  const session = await stripe.checkout.sessions.retrieve(req.query.session_id)
  console.log(session);
  res.send('Payment successful.');
  return;

})

app.listen(3000, () => {
  console.log('Listening on port 3000...');
})