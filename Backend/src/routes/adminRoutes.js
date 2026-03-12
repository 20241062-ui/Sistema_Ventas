import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';

// IMPORTANTE: Verifica si tu archivo es 'productoController.js' o 'productosController.js'
import { 
    obtenerDashboardProductos, 
    cambiarEstadoProducto, 
    agregarProducto, 
    eliminarProducto 
} from '../controllers/productoController.js'; 

const router = express.Router();

// Rutas protegidas por el middleware verificarAdmin
router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto);
router.post('/agregar', verificarAdmin, agregarProducto);
router.delete('/eliminar/:id', verificarAdmin, eliminarProducto);

export default router;