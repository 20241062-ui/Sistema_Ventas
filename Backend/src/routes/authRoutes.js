const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Esta es la ruta que llama tu main.js
router.post('/login', authController.login);

module.exports = router;