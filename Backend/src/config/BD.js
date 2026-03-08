import {createPool} from 'mysql2/promise'
import dotenv from 'dotenv'

//configuramos el acceso a nuestras variables de entorno 
dotenv.config()
console.log("Intentando conectar al host:", process.env.DB_HOST);

//creamos el pool de coneccion a la base de datos
const pool =createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:process.env.DB_PORT||3306,
    waitForConnections:true,
    connectionLimit:10,
    queueLimit:0
})


pool.getConnection()
  .then(conn => {
     console.log("✅ Conectado a MySQL");
     conn.release();
  })
  .catch(err => {
     console.error("❌ Error de conexión:", err.message);
  });


export default pool