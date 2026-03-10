import db from '../config/BD.js';

export const findUsuarioByEmail = async (email) => {

    const [rows] = await db.query(
        'SELECT id_usuario, vchcorreo, vchpassword, vchnombre, vchapellido, vchRol FROM tblusuario WHERE vchcorreo = ?',
        [email]
    );

    return rows[0];
};

export const createUsuario = async (nombre, apellido, email, passwordHash) => {

    const [result] = await db.query(
        `INSERT INTO tblusuario 
        (vchnombre, vchapellido, vchcorreo, vchpassword) 
        VALUES (?, ?, ?, ?)`,
        [nombre, apellido, email, passwordHash]
    );

    return result.insertId;
};