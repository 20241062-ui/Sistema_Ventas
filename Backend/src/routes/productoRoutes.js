import express from 'express';
import db from '../config/BD.js';

const router = express.Router();

// 1. RUTA PARA EL INICIO (INDEX)
router.get('/home', async (req, res) => {
    try {
        // 1. Intentamos traer el producto que tú quieres como destacado
        const [heroResult] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1', 
            ["VCH2007100"]
        );

        let hero = heroResult[0];

        // 2. PLAN B: Si el producto específico no existe o está desactivado, 
        // tomamos el producto más nuevo de la base de datos como Hero.
        if (!hero) {
            const [backup] = await db.query(
                'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 ORDER BY vchNo_Serie DESC LIMIT 1'
            );
            hero = backup[0];
        }

        // 3. Traemos el resto de los productos, asegurándonos de NO repetir el que ya está en el Hero
        // Usamos el ID del hero que hayamos encontrado (el original o el de respaldo)
        const heroIdParaExcluir = hero ? hero.vchNo_Serie : "";
        
        const [productos] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC LIMIT 8', 
            [heroIdParaExcluir]
        );

        res.json({ hero, productos });

    } catch (error) {
        console.error("Error en /home:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// 2. RUTA PARA CATEGORÍAS (CELULARES, ACCESORIOS, ETC) - CON RESPALDO
router.get('/categoria/:id', async (req, res) => {
    const { id } = req.params;
    
    // Mapeo de productos deseados
    const heroIds = {
        "1": "VCH2007200", // Hero de Celulares
        "2": "VCH2007101", // Hero de Accesorios
        "3": "ELE001"      // Hero de Electrodomésticos
    };
    
    const targetHeroId = heroIds[id] || "";

    try {
        // 1. Intentamos obtener el Hero específico de la categoría
        const [heroResult] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND intid_Categoria = ? AND Estado = 1 LIMIT 1', 
            [targetHeroId, id]
        );
        
        let heroFinal = heroResult[0];

        // 2. PLAN B: Si el Hero específico no existe, tomamos el producto más nuevo DE ESA CATEGORÍA
        if (!heroFinal) {
            const [fallback] = await db.query(
                'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND intid_Categoria = ? ORDER BY vchNo_Serie DESC LIMIT 1', 
                [id]
            );
            heroFinal = fallback[0];
        }

        const currentHeroId = heroFinal ? heroFinal.vchNo_Serie : "";

        // 3. Obtenemos el resto de productos de la categoría (excluyendo el Hero encontrado)
        const [productosResult] = await db.query(
            'SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND intid_Categoria = ? AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC', 
            [id, currentHeroId]
        );
        
        res.json({
            hero: heroFinal || null,
            productos: productosResult
        });

    } catch (error) {
        console.error(`Error en categoría ${id}:`, error);
        res.status(500).json({ error: error.message });
    }
});

// 3. RUTA PARA EL DETALLE DE UN PRODUCTO
router.get('/detalle/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ mensaje: "Producto no encontrado" });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;