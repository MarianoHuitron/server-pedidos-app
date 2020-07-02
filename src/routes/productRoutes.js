const express = require('express');
const router = express.Router();

const {verifyToken, isAdmin} = require('../middlewares/jwt');
const { createProduct, getProducts, getOneProduct, updateStatus, updateProducto } = require('../controllers/productController');


router.post('/create-product', isAdmin, createProduct);

router.get('/', verifyToken, getProducts);
router.get('/:idPro', verifyToken, getOneProduct);

router.put('/status-update/:idPro', isAdmin, updateStatus);
router.put('/update/:idProd', isAdmin, updateProducto);


module.exports = router;