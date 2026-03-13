import express from 'express';
import {getHomeProductos,getProductoDetalle,obtenerDashboardProductos,cambiarEstadoProducto} from '../controllers/productoController.js';

const router = express.Router();

router.get('/home', getHomeProductos);
router.get('/detalle/:id', getProductoDetalle);
router.get('/admin/productos', obtenerDashboardProductos);
router.patch('/admin/productos/estado/:id', cambiarEstadoProducto);

export default router;