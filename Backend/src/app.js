import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/BD.js';
import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
dotenv.config();

// Configuración de CORS para permitir tu sitio de GitHub Pages
app.use(cors());

app.use(express.json());

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

// PRUEBA DE CONEXIÓN
app.get('/api/prueba-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Conexión Exitosa" AS mensaje');
        res.json({ estado: "OK", db: rows[0].mensaje });
    } catch (error) {
        res.status(500).json({ estado: "Error", detalle: error.message });
    }
});

export default app;