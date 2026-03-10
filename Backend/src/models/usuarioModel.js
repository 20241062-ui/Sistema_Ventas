import db from '../config/BD.js';

const Usuario = {
    buscarPorCorreo: async (correo) => {
        const [rows] = await db.query('SELECT id_usuario, vchNombre, vchpassword, vchRol FROM tblusuario WHERE vchcorreo = ?', [correo]);
        return rows[0]; // Retorna el primer usuario encontrado
    }
};

export default Usuario;