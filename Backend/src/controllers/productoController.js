import {obtenerHero,obtenerProductos,obtenerProductoPorId,actualizarEstado} from '../models/productoModel.js';

export const getHomeProductos = async (req, res) => {
    try {

        const heroSerie = "S24U-002";

        const heroRows = await obtenerHero(heroSerie);
        const productosRows = await obtenerProductos(heroSerie);

        res.json({
            hero: heroRows[0] || null,
            productos: productosRows || []
        });

    } catch (error) {
        res.status(500).json({
            mensaje: "Error en servidor",
            detalle: error.message
        });
    }
};

export const getProductoDetalle = async (req, res) => {

    try {

        const { id } = req.params;
        const rows = await obtenerProductoPorId(id);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(rows[0]);

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener producto",
            detalle: error.message
        });

    }

};

export const cambiarEstadoProducto = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        await actualizarEstado(estado, id);

        res.json({ mensaje: "Estado actualizado" });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al cambiar estado",
            detalle: error.message
        });

    }

};