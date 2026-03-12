import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET || "una_clave_por_defecto_solo_para_local";

export const verificarAdmin = (req, res, next) => {
    // El token suele venir en el header como 'Bearer <token>'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        
        // Verificamos si el rol es Administrador
        if (decoded.rol !== 'Administrador') {
            return res.status(401).json({ message: 'Acceso no autorizado. Se requieren permisos de administrador.' });
        }

        req.usuario = decoded; // Guardamos los datos por si los necesitamos
        next(); // ¡Todo bien! Puede pasar a la ruta
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};