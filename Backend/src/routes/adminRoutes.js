import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
// AGREGAMOS LAS IMPORTACIONES QUE FALTABAN
import { 
    obtenerDashboardProductos, 
    cambiarEstadoProducto, 
    agregarProducto, 
    eliminarProducto 
} from '../controllers/productosController.js';

const router = express.Router();

router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto);
router.post('/agregar', verificarAdmin, agregarProducto);
router.delete('/eliminar/:id', verificarAdmin, eliminarProducto);

export default router;