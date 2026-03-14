import Producto from '../models/productoModel.js';

export const getDashboard = async (req, res) => {
    try {
        const buscar = req.query.buscar || "";
        const pagina = parseInt(req.query.pagina) || 1;
        const limite = 10;
        const offset = (pagina - 1) * limite;

        const data = await Producto.obtenerTodos(buscar, offset, limite);
        
        res.json({
            status: 'success',
            data: data.productos,
            stats: data.stats,
            pagination: {
                totalPaginas: Math.ceil(data.totalFiltrados / limite),
                paginaActual: pagina
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const updateEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const usuario = { nombre: req.user.nombre, rol: req.user.rol };

        await Producto.cambiarEstado(id, estado, usuario);
        res.json({ status: 'success', message: 'Estado actualizado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};