import express from 'express';
import { verificarAdmin } from '../middlewares/authMiddleware.js';
import { agregarProducto, eliminarProducto } from '../controllers/productosController.js';

const router = express.Router();

router.get('/productos', verificarAdmin, obtenerDashboardProductos);
router.patch('/productos/estado/:id', verificarAdmin, cambiarEstadoProducto);
// Esta ruta está "con llave". Si no hay token de Admin, devuelve error 401/403
router.post('/agregar', verificarAdmin, agregarProducto);
router.delete('/eliminar/:id', verificarAdmin, eliminarProducto);


export default router;