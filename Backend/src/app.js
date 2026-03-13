import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/BD.js';
import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import comprasRoutes from "./routes/comprasRoutes.js";

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
app.use('/api/compras', comprasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', ventaRoutes);

app.get('/api/prueba-db', async (req, res) => {
    try {
        // Intenta una consulta súper simple
        const [rows] = await db.query('SELECT 1 + 1 AS resultado');
        res.json({ 
            estado: "Conexión Exitosa", 
            db: rows[0].resultado === 2 ? "Base de datos respondiendo" : "Error inesperado" 
        });
    } catch (error) {
        res.status(500).json({ 
            estado: "Error de Conexión", 
            detalle: error.message 
        });
    }
});

export default app;