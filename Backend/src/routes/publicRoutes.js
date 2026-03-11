import express from 'express';
import { obtenerPoliticas } from '../controllers/publicController.js';

const router = express.Router();

router.get('/politicas', obtenerPoliticas);
router.get('/faq', obtenerFAQ);
router.get('/nosotros', obtenerNosotros);
router.get('/sucursales', obtenerSucursales);
router.get('/contacto-info', obtenerContactoInfo);
router.post('/enviar-mensaje', enviarMensajeContacto);

export default router;