import express from "express";
import { listarCompras, verCompra } from "../controllers/comprasController.js";

const router = express.Router();

// Esto ahora responde a GET /api/compras
router.get("/", listarCompras);

// Esto ahora responde a GET /api/compras/:id
router.get("/:id", verCompra);

export default router;