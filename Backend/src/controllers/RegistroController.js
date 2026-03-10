import bcrypt from 'bcryptjs';
import * as userModel from '../models/RegistroModel.js';

export const register = async (req, res) => {

    try {

        const { email, password, nombre_completo } = req.body;

        const partes = nombre_completo.split(" ");
        const nombre = partes[0];
        const apellido = partes.slice(1).join(" ");

        const existe = await userModel.findUsuarioByEmail(email);

        if (existe) {
            return res.status(409).json({
                message: "El correo ya está registrado"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const id = await userModel.createUsuario(
            nombre,
            apellido,
            email,
            passwordHash
        );

        res.status(201).json({
            message: "Usuario registrado correctamente",
            id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error en el servidor"
        });

    }

};