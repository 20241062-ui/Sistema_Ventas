import express from 'express';
import db from '../config/BD.js';

const router = express.Router();

// 1. RUTA PARA EL INICIO (INDEX)
router.get('/home', async (req, res) => {
    try {
        const [hero] = await db.query('SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = "VCH2007100" AND Estado = 1 LIMIT 1');
        const [productos] = await db.query('SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> "VCH2007100" ORDER BY vchNo_Serie DESC LIMIT 8');
        res.json({ hero: hero[0], productos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. RUTA PARA CATEGORÍAS (CELULARES, ACCESORIOS, ETC)
router.get('/categoria/:id', async (req, res) => {
    const { id } = req.params;
    // Mapeo de productos destacados (Hero) por categoría según tu lógica PHP
    const heroIds = {
        "1": "VCH2007200", // Hero de Celulares (POCO X7)
        "2": "VCH2007101", // Hero de Accesorios (Gamer Pro)
        "3": "ELE001"      // Hero de Electrodomésticos (Freidora)
    };
    const currentHeroId = heroIds[id] || "";

    try {
        const [heroResult] = await db.query('SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE vchNo_Serie = ? AND Estado = 1 LIMIT 1', [currentHeroId]);
        const [productosResult] = await db.query('SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen FROM tblproductos WHERE Estado = 1 AND intid_Categoria = ? AND vchNo_Serie <> ? ORDER BY vchNo_Serie DESC', [id, currentHeroId]);
        
        res.json({
            hero: heroResult[0] || null,
            productos: productosResult
        });
    } catch (error) {
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