import db from '../config/BD.js';

export const obtenerHero = async (serie) => {
    const [rows] = await db.query(
        'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1',
        [serie]
    );
    return rows;
};

export const obtenerProductos = async (serie) => {
    const [rows] = await db.query(
        'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC LIMIT 10',
        [serie]
    );
    return rows;
};

export const obtenerProductoPorId = async (id) => {
    const [rows] = await db.query(
        `SELECT p.vchNo_Serie, p.vchNombre, p.vchDescripcion, p.floPrecioUnitario, p.vchImagen, m.vchNombre AS Marca 
        FROM tblproductos p
        INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca
        WHERE p.vchNo_Serie = ? AND p.Estado = 1`,
        [id]
    );

    return rows;
};

export const actualizarEstado = async (estado, id) => {
    await db.query(
        "UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?",
        [estado, id]
    );
};