import jwt from 'jsonwebtoken';
import env, { config } from 'dotenv';

env.config();

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Token requerido.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Token no válido o expirado' });
    }
};

export default verificarToken