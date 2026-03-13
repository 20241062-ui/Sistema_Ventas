import express from 'express';
import { login } from '../controllers/authController.js';
import { register } from '../controllers/RegistroController.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

export default router;