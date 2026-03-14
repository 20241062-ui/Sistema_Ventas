import express from 'express';
import { obtenerDashboardProductos, cambiarEstadoProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/productos', obtenerDashboardProductos);
router.patch('/productos/estado/:id', cambiarEstadoProducto);

export default router;