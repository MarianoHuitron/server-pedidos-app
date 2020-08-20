const express = require('express');
const router = express.Router();

const { sendMessage } = require('../controllers/mailController');

router.post('/send', sendMessage);

module.exports = router;