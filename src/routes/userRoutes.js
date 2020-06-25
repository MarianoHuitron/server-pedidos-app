const express = require('express');
const router = express.Router();

const {newUser, auth, x, createAdress} = require('../controllers/userController');
const { varifyToken } = require('../middlewares/jwt');

router.post('/create', newUser);
router.post('/login', auth);
router.post('/create-adress', varifyToken, createAdress);




module.exports = router;