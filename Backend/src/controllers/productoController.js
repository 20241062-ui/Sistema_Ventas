import db from '../config/BD.js';

export const getHomeProductos = async (req, res) => {
    try {
        // Usamos el ID que confirmaste que existe en Hostinger
        const heroSerie = 'S24U-002'; 

        // 1. Obtener el producto Hero
        const [heroRows] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1',
            [heroSerie]
        );

        // 2. Obtener los productos destacados (excluyendo el hero)
        const [productosRows] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC LIMIT 10',
            [heroSerie]
        );

        res.json({
            hero: heroRows[0] || null,
            productos: productosRows
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en el servidor", detalle: error.message });
    }
};
export const getProductoDetalle = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = `
            SELECT p.vchNo_Serie, p.vchNombre, p.vchDescripcion, p.floPrecioUnitario, p.vchImagen, m.vchNombre AS Marca 
            FROM tblproductos p 
            INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca 
            WHERE p.vchNo_Serie = ? AND p.Estado = 1`;

        const [rows] = await db.query(sql, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener el detalle", detalle: error.message });
    }
};
export const cambiarEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await db.query("UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?", [estado, id]);
        res.json({ mensaje: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cambiar estado", detalle: error.message });
    }
};

// También asegúrate de exportar estas aunque estén vacías por ahora para que no truene el router:
export const agregarProducto = async (req, res) => { /* tu lógica */ };
export const eliminarProducto = async (req, res) => { /* tu lógica */ };