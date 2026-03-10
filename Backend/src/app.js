import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
//import productoRoutes from './routes/productoRoutes.js';
import authRoutes from './routes/authRoutes.js'; // Nueva ruta

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//app.use('/api', productoRoutes);
app.use('/api/auth', authRoutes); // Prefijo para autenticación

app.get('/api/prueba-db', async (req, res) => {
    try {
        // Hacemos una consulta simple que no dependa de tus tablas
        const [rows] = await db.query('SELECT "Conexión Exitosa" AS mensaje');
        res.json({
            estado: "OK",
            servidor: "Vercel",
            db: rows[0].mensaje
        });
    } catch (error) {
        res.status(500).json({
            estado: "Error",
            mensaje: "No se pudo conectar a la base de datos de Hostinger",
            detalle: error.message
        });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en http://localhost:${PORT}`);
});