import db from '../config/BD.js';

export const getHomeProductos = async (req, res) => {
    try {
        const heroSerie = 'S24U-002'; 

        // 1. Obtener el producto Hero
        const [heroRows] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1',
            [heroSerie]
        );

        // 2. Obtener los productos destacados
        const [productosRows] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC LIMIT 10',
            [heroSerie]
        );

        // --- BLOQUE DE SEGURIDAD ---
        // Si por alguna razón la BD no responde con arrays, evitamos el crash
        const hero = (heroRows && heroRows.length > 0) ? heroRows[0] : null;
        const productos = (productosRows) ? productosRows : [];

        res.json({
            hero: hero,
            productos: productos
        });

    } catch (error) {
        console.error("Error en getHomeProductos:", error.message);
        // Enviamos una estructura vacía pero válida para que el JS del frontend no lance error de "undefined"
        res.status(500).json({ 
            mensaje: "Error en el servidor", 
            hero: null, 
            productos: [], 
            detalle: error.message 
        });
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

        if (!rows || rows.length === 0) {
            return res.status(404).json({ mensaje: "Producto no encontrado" });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error("Error en getProductoDetalle:", error.message);
        res.status(500).json({ mensaje: "Error al obtener el detalle", detalle: error.message });
    }
};
export const obtenerDashboardProductos = async (req, res) => {
    const busqueda = req.query.buscar || "";
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = 10;
    const offset = (pagina - 1) * limite;

    try {
        // Obtenemos conteos usando tus funciones de BD
        const [totalRes] = await db.query("SELECT fn_contar_productos_por_estado(-1) AS total");
        const [activosRes] = await db.query("SELECT fn_contar_productos_por_estado(1) AS activos");
        const [inactivosRes] = await db.query("SELECT fn_contar_productos_por_estado(0) AS inactivos");

        // Obtenemos lista y total filtrado mediante Procedimientos Almacenados
        const [totalFiltrados] = await db.query("CALL sp_contar_productos(?)", [busqueda]);
        const [productosData] = await db.query("CALL sp_obtener_productos(?, ?, ?)", [busqueda, offset, limite]);

        res.json({
            counts: {
                total: totalRes[0]?.total || 0,
                activos: activosRes[0]?.activos || 0,
                inactivos: inactivosRes[0]?.inactivos || 0
            },
            productos: productosData[0] || [],
            pagination: {
                totalItems: totalFiltrados[0][0]?.total || 0,
                totalPages: Math.ceil((totalFiltrados[0][0]?.total || 0) / limite),
                currentPage: pagina
            }
        });
    } catch (error) {
        console.error("Error en dashboard:", error);
        res.status(500).json({ mensaje: "Error al cargar dashboard", error: error.message });
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