import express from 'express';
import { dashboardProductos, cambiarEstadoProducto } from '../controllers/productoController.js';

const router = express.Router();

router.get('/', dashboardProductos); 
router.patch('/estado/:id', cambiarEstadoProducto);

export default router;