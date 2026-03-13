const comprasModel = require("../models/comprasModel")

const listarCompras = async (req,res) => {

    try{

        const compras = await comprasModel.obtenerCompras()

        res.json({
            total: compras.length,
            compras: compras
        })

    }catch(error){

        res.status(500).json({
            error:"Error obteniendo compras"
        })

    }

}

const verCompra = async (req,res) => {

    try{

        const {id} = req.params

        const detalle = await comprasModel.obtenerCompraPorId(id)

        res.json(detalle)

    }catch(error){

        res.status(500).json({
            error:"Error obteniendo detalle"
        })

    }

}

module.exports = {
    listarCompras,
    verCompra
}