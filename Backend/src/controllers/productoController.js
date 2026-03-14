import { obtenerDashboardProductos, actualizarEstado } from '../models/productoModel.js';

export const dashboardProductos = async (req, res) => {
    try {
        const pagina = parseInt(req.query.pagina) || 1;
        const buscar = req.query.buscar || "";
        const limite = 10;
        const offset = (pagina - 1) * limite;

        const data = await obtenerDashboardProductos(buscar, offset, limite);

        res.json({
            counts: data.counts,
            productos: data.productos,
            pagination: {
                currentPage: pagina,
                totalPages: Math.ceil(data.totalFiltrados / limite),
                totalRecords: data.totalFiltrados
            }
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener productos", detalle: error.message });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        await actualizarEstado(estado, id);
        res.json({ mensaje: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al cambiar estado", detalle: error.message });
    }
};