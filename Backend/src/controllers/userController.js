import db from '../config/BD.js';
import bcrypt from 'bcryptjs';

export const actualizarDatosPerfil = async (req, res) => {
    const { vchNombre, vchApellido_Paterno, vchApellido_Materno, vchTelefono, vchpassword } = req.body;
    const userId = req.usuarioId;

    try {
        // 1. Obtener la contraseña actual por si no se desea cambiar
        const [user] = await db.query('SELECT vchPassword FROM tblcliente WHERE id_usuario = ?', [userId]);
        
        let passwordFinal = user[0].vchPassword;
        if (vchpassword && vchpassword.trim() !== "") {
            passwordFinal = await bcrypt.hash(vchpassword, 10);
        }

        // 2. Ejecutar el UPDATE
        await db.query(
            `UPDATE tblcliente SET vchNombre = ?, vchApellido_Paterno = ?, vchApellido_Materno = ?, vchTelefono = ?, vchPassword = ? 
            WHERE id_usuario = ?`,
            [vchNombre, vchApellido_Paterno, vchApellido_Materno, vchTelefono || null, passwordFinal, userId]
        );

        res.json({ success: true, message: 'Perfil actualizado correctamente.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const obtenerDatosPerfil = async (req, res) => {
    try {
        // req.usuarioId viene del middleware de verificación de token
        const [rows] = await db.query(
            'SELECT vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo FROM tblcliente WHERE id_usuario = ?', 
            [req.usuarioId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};