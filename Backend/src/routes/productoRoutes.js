import express from 'express';
import { obtenerDashboardProductos, cambiarEstadoProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/', obtenerDashboardProductos);
router.patch('/estado/:id', cambiarEstadoProducto);

export default router;