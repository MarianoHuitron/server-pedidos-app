const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { createSession, webhookEvents, checkSession } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/jwt');

router.post('/checkout', verifyToken, createSession);
router.get('/checkout-session/:sessionId', verifyToken, checkSession);
// Events webhooks
router.post('/', bodyParser.raw({type: 'application/json'}), webhookEvents);
module.exports = router;