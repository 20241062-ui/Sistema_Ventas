import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/BD.js';
import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

// Configuración de CORS para permitir tu sitio de GitHub Pages
app.use(cors({
    origin: ['https://20241062-ui.github.io', 'http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);

// PRUEBA DE CONEXIÓN
app.get('/api/prueba-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Conexión Exitosa" AS mensaje');
        res.json({ estado: "OK", db: rows[0].mensaje });
    } catch (error) {
        res.status(500).json({ estado: "Error", detalle: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;