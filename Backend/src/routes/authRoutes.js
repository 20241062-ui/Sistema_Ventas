import express from 'express';
import { login } from '../controllers/authController.js';
import verificador from '..//Middlewere/authMiddlewere.js'

const router = express.Router();

router.post('/login', login)
router.post('/', verificador, ctrl.createAlumno);

export default router;