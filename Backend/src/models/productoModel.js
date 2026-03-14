import db from '../config/BD.js';

export const obtenerDashboardProductos = async (buscar = '', offset = 0, limite = 10) => {
    const queryBusqueda = `%${buscar}%`;
    
    
    const [productos] = await db.query(`
        SELECT vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, intStock, Estado
        FROM tblproductos
        WHERE vchNombre LIKE ? OR vchNo_Serie LIKE ?
        LIMIT ? OFFSET ?
    `, [queryBusqueda, queryBusqueda, limite, offset]);

   
    const [counts] = await db.query(`
        SELECT 
            COUNT(*) as total,
            SUM(CASE WHEN Estado = 1 THEN 1 ELSE 0 END) as activos,
            SUM(CASE WHEN Estado = 0 THEN 1 ELSE 0 END) as inactivos
        FROM tblproductos
    `);

   
    const [totalFiltrado] = await db.query(`
        SELECT COUNT(*) as total FROM tblproductos 
        WHERE vchNombre LIKE ? OR vchNo_Serie LIKE ?
    `, [queryBusqueda, queryBusqueda]);

    return {
        productos,
        counts: counts[0],
        totalFiltrados: totalFiltrado[0].total
    };
};

export const actualizarEstado = async (estado, id) => {
    await db.query('UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?', [estado, id]);
};