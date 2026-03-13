import db from '../config/BD.js';

/* LISTAR VENTAS */
export const obtenerVentas = async (req, res) => {

    const busqueda = req.query.buscar || "";

    try {

        /* procedimiento almacenado */
        const [ventasData] = await db.query(
            "CALL sp_listar_ventas(?)",
            [busqueda]
        );

        const ventas = ventasData[0] || [];

        /* total ventas */
        const [totalRes] = await db.query(
            "SELECT COUNT(*) AS total FROM tblventas"
        );

        res.json({
            total: totalRes[0].total,
            ventas
        });

    } catch (error) {

        console.error("Error obtenerVentas:", error);

        res.status(500).json({
            mensaje: "Error al obtener ventas",
            error: error.message
        });
    }
};


/* DETALLE DE VENTA */
export const obtenerDetalleVenta = async (req, res) => {

    const id = req.params.id;

    try {

        const [result] = await db.query(
            "CALL sp_ver_detalle_venta(?)",
            [id]
        );

        const venta = result[0][0];
        const detalle = result[1];

        if (!venta) {
            return res.status(404).json({
                mensaje: "Venta no encontrada"
            });
        }

        res.json({
            venta,
            detalle
        });

    } catch (error) {

        console.error("Error detalle venta:", error);

        res.status(500).json({
            mensaje: "Error al obtener detalle",
            error: error.message
        });

    }
};