import db from '../config/BD.js';

export const obtenerDashboardProductos = async (req, res) => {
    const busqueda = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const offset = (pagina - 1) * limite;

    try {
        // 1. Obtener conteos generales usando tus funciones de BD
        const [totalRes] = await db.query("SELECT fn_contar_productos_por_estado(-1) AS total");
        const [activosRes] = await db.query("SELECT fn_contar_productos_por_estado(1) AS activos");
        const [inactivosRes] = await db.query("SELECT fn_contar_productos_por_estado(0) AS inactivos");

        // 2. Obtener total filtrado para paginación (Llamada al procedimiento)
        const [totalFiltrados] = await db.query("CALL sp_contar_productos(?)", [busqueda]);
        const totalItems = totalFiltrados[0][0].total;

        // 3. Obtener lista de productos (Llamada al procedimiento)
        const [productosData] = await db.query("CALL sp_obtener_productos(?, ?, ?)", [busqueda, offset, limite]);

        res.json({
            counts: {
                total: totalRes[0].total,
                activos: activosRes[0].activos,
                inactivos: inactivosRes[0].inactivos
            },
            productos: productosData[0],
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limite),
                currentPage: pagina
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
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