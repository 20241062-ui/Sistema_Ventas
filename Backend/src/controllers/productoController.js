import {
    obtenerHero,
    obtenerProductos,
    obtenerDashboardProductos,
    actualizarEstado
} from '../models/productoModel.js';

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

export const dashboardProductos = async (req, res) => {

    try {

        const rows = await obtenerDashboardProductos();

        res.json({
            counts: {
                total: rows.length,
                activos: rows.filter(p => p.Estado == 1).length,
                inactivos: rows.filter(p => p.Estado == 0).length
            },
            productos: rows
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al obtener productos",
            detalle: error.message
        });

    }

};

export const cambiarEstadoProducto = async (req, res) => {

    try {

        const { id } = req.params;
        const { estado } = req.body;

        await actualizarEstado(estado, id);

        res.json({
            mensaje: "Estado actualizado correctamente"
        });

    } catch (error) {

        res.status(500).json({
            mensaje: "Error al cambiar estado",
            detalle: error.message
        });

    }

};