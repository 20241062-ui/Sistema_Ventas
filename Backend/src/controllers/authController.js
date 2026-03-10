import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = "tu_clave_secreta_super_segura"; // En producción, esto va en un archivo .env

export const login = async (req, res) => {
    const { user, password } = req.body; // 'user' es el correo según tu PHP

    try {
        const usuario = await Usuario.buscarPorCorreo(user);

        if (!usuario) {
            return res.status(404).json({ message: 'No se encontró ningún usuario con ese correo.' });
        }

        // Comparar contraseña usando bcrypt (equivalente a password_verify de PHP)
        const passwordCorrecta = await bcrypt.compare(password, usuario.vchpassword);

        if (!passwordCorrecta) {
            return res.status(401).json({ message: 'Contraseña Inválida.' });
        }

        // Si todo es correcto, crear el JWT
        const token = jwt.sign(
            { id: usuario.id_usuario, nombre: usuario.vchNombre, rol: usuario.vchRol },
            SECRET_KEY,
            { expiresIn: '2h' } // El token expira en 2 horas
        );

        // Enviamos el token y los datos necesarios al Front
        res.json({
            message: 'Login exitoso',
            token,
            user: {
                nombre: usuario.vchNombre,
                rol: usuario.vchRol
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};