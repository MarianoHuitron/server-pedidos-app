const express = require('express');
const router = express.Router();

const { 
    newUser, 
    auth, 
    createAddress, 
    updateAddress, 
    getAddresses, 
    addCart, 
    updateCantCart,
    removeProdCart,
    getCartProducts
} = require('../controllers/userController');
const { verifyToken } = require('../middlewares/jwt');

router.post('/create', newUser);
router.post('/login', auth);
router.post('/create-address', verifyToken, createAddress);

router.get('/get-address', verifyToken, getAddresses);
router.get('/cart-get', verifyToken, getCartProducts);

router.put('/update-address/:address', verifyToken, updateAddress)
router.put('/cart-add/', verifyToken, addCart);
router.put('/cart-update', verifyToken, updateCantCart)
router.put('/cart-remove/:idProd', verifyToken, removeProdCart)

router.get('/', (req, res) => {
    res.send('hello')
})

module.exports = router;