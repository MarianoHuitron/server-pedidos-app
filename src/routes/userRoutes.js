const express = require('express');
const router = express.Router();

const {newUser, auth, createAddress, updateAddress, getAddresses} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/jwt');

router.post('/create', newUser);
router.post('/login', auth);
router.post('/create-address', verifyToken, createAddress);

router.get('/get-address', verifyToken, getAddresses);

router.put('/update-address/:address', verifyToken, updateAddress)




module.exports = router;