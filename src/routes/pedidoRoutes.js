const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { createSession, webhookEvents } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/jwt');

router.post('/checkout', verifyToken, createSession);

// Events webhooks
router.post('/', bodyParser.raw({type: 'application/json'}), webhookEvents);
module.exports = router;