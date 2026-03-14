import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/BD.js';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ventaRoutes from './routes/ventaRoutes.js';
import comprasRoutes from './routes/comprasRoutes.js';
import productoRoutes from './routes/productoRoutes.js';

const app = express();
dotenv.config();

const corsOptions = {
    origin: 'https://20241062-ui.github.io', 
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};


app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ventas', ventaRoutes);
app.use('/api/productos', productoRoutes);

app.get('/api/prueba-db', async (req, res) => {
    try {
        
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