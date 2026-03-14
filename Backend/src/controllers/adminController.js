import db from '../config/BD.js';

export const obtenerDashboardProductos = async (req, res) => {
    const busqueda = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const offset = (pagina - 1) * limite;

    try {
        const [totalRes] = await db.query("SELECT fn_contar_productos_por_estado(-1) AS total");
        const [activosRes] = await db.query("SELECT fn_contar_productos_por_estado(1) AS activos");
        const [inactivosRes] = await db.query("SELECT fn_contar_productos_por_estado(0) AS inactivos");

        const [totalFiltradosData] = await db.query("CALL sp_contar_productos(?)", [busqueda]);
        const totalItems = totalFiltradosData[0][0]?.total || 0;

     
        const [productosData] = await db.query("CALL sp_obtener_productos(?, ?, ?)", [busqueda, offset, limite]);
       
        const listaProductos = productosData[0] || [];

        res.json({
            counts: {
                total: totalRes[0]?.total || 0,
                activos: activosRes[0]?.activos || 0,
                inactivos: inactivosRes[0]?.inactivos || 0
            },
            productos: listaProductos,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limite) || 1,
                currentPage: pagina
            }
        });
    } catch (error) {
        console.error("Error en obtenerDashboardProductos:", error);
        res.status(500).json({ 
            mensaje: "Error interno del servidor al procesar el dashboard",
            error: error.message 
        });
    }
};

export const cambiarEstadoProducto = async (req, res) => {
    const { id } = req.params;
    const { estado } = req.body; // 1 o 0
    try {
        await db.query("UPDATE tblproducto SET Estado = ? WHERE vchNo_Serie = ?", [estado, id]);
        res.json({ message: "Estado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};