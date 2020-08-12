const express = require('express');
const router = express.Router();

const { createSession, webhookEvents } = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/jwt');

router.post('/checkout', verifyToken, createSession);

// Events webhooks
router.post('/', webhookEvents);
module.exports = router;