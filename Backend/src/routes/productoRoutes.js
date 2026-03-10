import express from 'express';
import { getHomeProductos } from '../controllers/productoController.js';

const router = express.Router();

router.get('/home', getHomeProductos);
router.get('/detalle/:id', getProductoDetalle);

export default router;