import db from '../config/BD.js';

import db from '../config/BD.js';

export const obtenerDashboardProductos = async (req, res) => {
    const busqueda = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const offset = (pagina - 1) * limite;

    try {
        // 1. Obtener conteos generales
        // Nota: Asegúrate de que los nombres de las columnas coincidan con lo que devuelve la función
        const [totalRes] = await db.query("SELECT fn_contar_productos_por_estado(-1) AS total");
        const [activosRes] = await db.query("SELECT fn_contar_productos_por_estado(1) AS activos");
        const [inactivosRes] = await db.query("SELECT fn_contar_productos_por_estado(0) AS inactivos");

        // 2. Obtener total filtrado para paginación
        // IMPORTANTE: Los procedimientos devuelven un array de arrays. 
        // El primer elemento [0] son los resultados, el segundo [1] es metadata.
        const [totalFiltradosData] = await db.query("CALL sp_contar_productos(?)", [busqueda]);
        // Accedemos correctamente al primer registro del primer set de resultados
        const totalItems = totalFiltradosData[0][0]?.total || 0;

        // 3. Obtener lista de productos
        const [productosData] = await db.query("CALL sp_obtener_productos(?, ?, ?)", [busqueda, offset, limite]);
        // Igual aquí: los resultados están en el índice [0] del set devuelto por el CALL
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