import express from 'express';
import { obtenerDatosPerfil } from '../controllers/userController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/perfil', verificarToken, obtenerDatosPerfil);
router.put('/actualizar', verificarToken, actualizarDatosPerfil);

export default router;