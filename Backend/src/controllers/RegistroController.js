import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuarioModelo from '../models/registroModelo.js';


export const Registrar = async (req, res) => {
    try{
        const {email, password, nombre_completo} = req.body;

    }
    catch (error) 
    {
        res.status(500).jsaon({error:'Error en el proceso de login'});
    }
};
