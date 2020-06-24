const express = require('express');
const router = express.Router();

const {newUser, auth, x} = require('../controllers/userController');
const { varifyToken } = require('../middlewares/jwt');

router.post('/create', newUser);
router.post('/login', auth);
router.get('/', varifyToken, x);




module.exports = router;