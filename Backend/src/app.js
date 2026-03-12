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

// 1. Configuración de CORS única y específica
const corsOptions = {
    origin: 'https://20241062-ui.github.io', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// 2. Aplicar CORS antes que las rutas
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Maneja las peticiones de preflight

app.use(express.json());

// 3. RUTAS
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