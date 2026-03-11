import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables del .env o del panel de Vercel

const pool = mysql.createPool({
    // Usamos process.env para que sea seguro y dinámico
    host: process.env.DB_HOST ,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Mantenemos tu prueba de conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error en BD:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos');
    connection.release();
});

export default promisePool;