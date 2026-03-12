import Usuario from '../models/usuarioModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "una_clave_por_defecto_solo_para_local";

export const login = async (req, res) => {
    const { user, password } = req.body; 

    try {
        const usuario = await Usuario.buscarPorCorreo(user);

        if (!usuario) {
            return res.status(404).json({ message: 'No se encontró ningún usuario con ese correo.' });
        }

        // --- CORRECCIÓN 1: COMPROBACIÓN DE CONTRASEÑA ---
        // Si tus contraseñas en la BD NO están encriptadas con bcrypt, cambia esto:
        let passwordCorrecta = false;
        
        if (usuario.vchpassword.startsWith('$2')) {
            // Si la contraseña en BD empieza con $2, es bcrypt
            passwordCorrecta = await bcrypt.compare(password, usuario.vchpassword);
        } else {
            // Si no, es texto plano (compara directamente)
            passwordCorrecta = (password === usuario.vchpassword);
        }

        if (!passwordCorrecta) {
            return res.status(401).json({ message: 'Contraseña Inválida.' });
        }

        // --- CORRECCIÓN 2: PROPIEDADES DEL TOKEN ---
        // Asegúrate de que los nombres coincidan con el modelo (ej: intid_Usuario o id_usuario)
        const token = jwt.sign(
            { 
                id: usuario.intid_Usuario || usuario.id_usuario, 
                nombre: usuario.vchNombre, 
                rol: usuario.vchRol 
            },
            SECRET_KEY,
            { expiresIn: '24h' } 
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                nombre: usuario.vchNombre,
                rol: usuario.vchRol
            }
        });

    } catch (error) {
        console.error("Error en login:", error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};