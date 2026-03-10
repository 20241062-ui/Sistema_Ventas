import mysql from 'mysql2';

// Crear el "pool" de conexiones (más eficiente que una conexión única)
const pool = mysql.createPool({
    host: 'srv760.hstgr.io',
    port:3306,
    user: 'u138650717_ComerLL',               // El usuario de la base de datos
    password: 'Ivanbm12345#',          // La contraseña del usuario
    database: 'u138650717_ComerLL',      // El nombre de la base de datos
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Prueba de conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error en BD:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a la base de datos');
    connection.release();
});

export default promisePool;
