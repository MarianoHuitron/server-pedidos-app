const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Pedido = require('../models/pedidoModel');
const token = require('../middlewares/jwt');

async function createSession(req, res) {
    const payload = token.decodeToken(req.token);
    const userId = payload.payload.sub;
    const items = req.body.items;
    let line_data = [];
 

    items.map(item => {
        const info = {
            price_data: {
                currency: 'mxn',
                product_data: {
                    name: item.product.name
                },
                unit_amount: Number(item.product.price * 100)
            },
            quantity: Number(item.cant)
        };

        line_data.push(info);
    });



    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_data,
        mode: 'payment',
        success_url: process.env.DOMAIN + '/pago',  //TODO: ADD SESSION ID
        cancel_url: process.env.DOMAIN + '/domicilio',
    });

    res.json({session_id: session.id});
}


async function webhookEvents(req, res) {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    if (eventType === 'checkout.session.completed') {
      console.log(`🔔  Payment received!`);
    }
  
    res.sendStatus(200);
}






module.exports = {
    createSession,
    webhookEvents
}