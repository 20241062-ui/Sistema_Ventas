const User = require('../models/userModel');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const { user, password } = req.body;

    User.findByEmail(user, async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Error en el servidor" });
        
        if (results.length > 0) {
            const usuario = results[0];
            // Comparamos la clave enviada con el hash de la base de datos
            const match = await bcrypt.compare(password, usuario.vchpassword);

            if (match) {
                res.json({
                    success: true,
                    nombre: usuario.vchnombre,
                    rol: usuario.vchRol // Retorna: Administrador, Vendedor o Encargado
                });
            } else {
                res.status(401).json({ success: false, message: "Contraseña incorrecta" });
            }
        } else {
            res.status(404).json({ success: false, message: "Usuario no encontrado" });
        }
    });
};