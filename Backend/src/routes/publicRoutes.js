import express from 'express';
import { obtenerPoliticas } from '../controllers/publicController.js';
import { obtenerFAQ } from '../controllers/publicController.js';
import { obtenerNosotros } from '../controllers/publicController.js';
import { obtenerSucursales } from '../controllers/publicController.js';
import { obtenerContactoInfo } from '../controllers/publicController.js';
import { enviarMensajeContacto } from '../controllers/publicController.js';

const router = express.Router();

router.get('/politicas', obtenerPoliticas);
router.get('/faq', obtenerFAQ);
router.get('/nosotros', obtenerNosotros);
router.get('/sucursales', obtenerSucursales);
router.get('/contacto-info', obtenerContactoInfo);
router.post('/enviar-mensaje', enviarMensajeContacto);

export default router;