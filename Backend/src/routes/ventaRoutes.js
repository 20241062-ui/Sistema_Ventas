import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import {obtenerVentas,obtenerDetalleVenta} from '../controllers/ventaController.js';

const router = express.Router();

router.get('/ventas', verificarAdmin, obtenerVentas);
router.get('/ventas/:id', verificarAdmin, obtenerDetalleVenta);

export default router;