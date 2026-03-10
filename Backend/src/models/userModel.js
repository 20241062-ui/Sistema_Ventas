import pool from '../config/BD.js';

const User = {
    findByEmail: async (email) => {
        try {
            
            const sql = `SELECT id_usuario, vchnombre, vchpassword, vchRol FROM tblusuario WHERE vchcorreo = ? AND Estado = 1`;
                
            const [rows] = await pool.query(sql, [email]);
            
          
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Error en la consulta SQL:", error);
            throw error;
        }
    }
};

export default User;