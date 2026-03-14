import db from '../config/BD.js';

export const obtenerHero = async (serie) => {
    const [rows] = await db.query(
        `SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen 
        FROM tblproductos 
        WHERE vchNo_Serie = ? AND Estado = 1 
        LIMIT 1`,
        [serie]
    );
    return rows;
};

export const obtenerProductos = async (serie) => {
    const [rows] = await db.query(
        `SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen 
        FROM tblproductos 
        WHERE Estado = 1 AND vchNo_Serie <> ? 
        ORDER BY vchNo_Serie DESC 
        LIMIT 10`,
        [serie]
    );
    return rows;
};

export const obtenerDashboardProductos = async () => {
    const [rows] = await db.query(`
        SELECT 
            vchNo_Serie,
            vchNombre,
            vchDescripcion,
            floPrecioUnitario,
            intStock,
            Estado
        FROM tblproductos
    `);

    return rows;
};

export const actualizarEstado = async (estado, id) => {
    await db.query(
        `UPDATE tblproductos 
        SET Estado = ? 
        WHERE vchNo_Serie = ?`,
        [estado, id]
    );
};