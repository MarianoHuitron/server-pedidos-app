const express = require('express');
const router = express.Router();

const {newUser} = require('../controllers/userController');

router.post('/create', newUser);




module.exports = router;