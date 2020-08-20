const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

const { createSession, webhookEvents, checkSession } = require('../controllers/paymentController');
const { verifyToken, isAdmin } = require('../middlewares/jwt');

const { getPedidos, updateStatus, getPedidosByUser, countPedidos, countVentas, totalVentas, PedidosTotales, mejoresClientes, panesMasVendidos } = require('../controllers/pedidoController');

// Checkout streap
router.post('/checkout', verifyToken, createSession);
router.get('/checkout-session/:sessionId', verifyToken, checkSession);


// Pedidos
router.get('/list', verifyToken, getPedidos);
router.put('/change-status', verifyToken, updateStatus);
router.get('/count', isAdmin, countPedidos);
router.get('/count-ventas', isAdmin, countVentas);
router.get('/total-dia', isAdmin, totalVentas);
router.get('/clientes-chart', isAdmin, mejoresClientes)
router.get('/mas-vendidos-chart', isAdmin, panesMasVendidos)

// Pedidos de usuario
router.get('/list-pedidos-user', verifyToken, getPedidosByUser);



// Events webhooks
router.post('/', bodyParser.raw({type: 'application/json'}), webhookEvents);
module.exports = router;