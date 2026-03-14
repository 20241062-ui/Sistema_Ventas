import express from 'express';

import {
    dashboardProductos,
    cambiarEstadoProducto,
    getHomeProductos
} from '../controllers/productoController.js';

const router = express.Router();

router.get('/home', getHomeProductos);   
router.get('/', dashboardProductos);
router.patch('/estado/:id', cambiarEstadoProducto);

export default router;