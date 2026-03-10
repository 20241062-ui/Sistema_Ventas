import db from '../config/BD.js';

export const getHomeProductos = async (req, res) => {
    try {
        const heroSerie = 'VCH2007100'; // La misma que usas en PHP

        // 1. Obtener el producto Hero
        const [hero] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1',
            [heroSerie]
        );

        // 2. Obtener los productos destacados (limitados a 10 como en tu paginación)
        const [productos] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC LIMIT 10',
            [heroSerie]
        );

        res.json({
            hero: hero[0] || null,
            productos: productos
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", detalle: error.message });
    }
};