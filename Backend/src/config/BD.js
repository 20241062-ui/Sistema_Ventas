import { createPool } from 'mysql2/promise'
import dotenv from 'dotenv'

// Configuramos el acceso a nuestras variables de entorno 
dotenv.config()

// Creamos el pool de conexión a la base de datos
const pool = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Corregido: llevaba D al final
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default pool