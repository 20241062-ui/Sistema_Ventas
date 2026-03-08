import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {   
        const usuario = await User.findByEmail(user);

        if (!usuario) {
            return res.status(404).json({ 
                success: false, 
                message: "El usuario no existe." 
            });
        }

        let hash = usuario.vchpassword;

        // convertir hash de PHP ($2y$) a formato compatible
        if (hash.startsWith("$2y$")) {
            hash = hash.replace("$2y$", "$2b$");
        }

        const match = await bcrypt.compare(password, hash);

        if (match) {
            return res.json({
                success: true,
                nombre: usuario.vchnombre,
                rol: usuario.vchRol
            });
        } else {
            return res.status(401).json({ 
                success: false, 
                message: "La contraseña es incorrecta." 
            });
        }

    } catch (error) {
        console.error("Error en el proceso de login:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Error interno del servidor." 
        });
    }
};