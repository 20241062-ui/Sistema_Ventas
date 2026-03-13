import express from "express"
import { listarCompras, verCompra } from "../controllers/comprasController.js"

const router = express.Router()

router.get("/compras", listarCompras)

router.get("/compras/:id", verCompra)

export default router