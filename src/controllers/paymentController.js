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
    let event = req.body;
    console.log(event)
    switch(event.type) {

      case 'payment_intent.succeeded': 
        console.log('payment_intent.succeeded');
        break;
      case 'payment_method.attached':
        console.log('payment_method.attached')
        break;
      default:
        return res.status(400).end();

    }
    res.json({received: true});
   
}






module.exports = {
    createSession,
    webhookEvents
}