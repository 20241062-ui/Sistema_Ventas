import User from '../models/userModel.js';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { user, password } = req.body;

    try {   
        const usuario = await User.findByEmail(user);

        if (usuario) {
           
            const match = await bcrypt.compare(password, usuario.vchpassword);

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
        } else {
            
            return res.status(404).json({ 
                success: false, 
                message: "El usuario no existe." 
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