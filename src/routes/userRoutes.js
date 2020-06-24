const express = require('express');
const router = express.Router();

const {newUser} = require('../controllers/userController');

router.get('/', newUser);




module.exports = router;