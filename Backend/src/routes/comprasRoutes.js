import express from "express";
import { listarCompras, verCompra } from "../controllers/comprasController.js";

const router = express.Router();

router.get("/", listarCompras);
router.get("/:id", verCompra);

export default router;