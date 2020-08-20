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
    getCartProducts,
    getUsersAdmin,
    countCustomers
} = require('../controllers/userController');
const { verifyToken, isAdmin } = require('../middlewares/jwt');

router.post('/create', newUser);
router.post('/login', auth);
router.post('/create-address', verifyToken, createAddress);

router.get('/get-address', verifyToken, getAddresses);
router.get('/cart-get', verifyToken, getCartProducts);
router.get('/users-admin', isAdmin, getUsersAdmin);
router.get('/count', isAdmin, countCustomers);

router.put('/update-address/:address', verifyToken, updateAddress)
router.put('/cart-add/', verifyToken, addCart);
router.put('/cart-update', verifyToken, updateCantCart);

router.delete('/cart-remove/:idProd', verifyToken, removeProdCart)

router.get('/', (req, res) => {
    res.send('hello')
})

module.exports = router;