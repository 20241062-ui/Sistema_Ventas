import express from 'express';
// IMPORTANTE: Asegúrate de incluir AMBAS funciones en el import
import { getHomeProductos, getProductoDetalle } from '../controllers/productoController.js';

const router = express.Router();

router.get('/home', getHomeProductos);
router.get('/detalle/:id', getProductoDetalle); // Línea 7 que mencionaba el error

export default router;