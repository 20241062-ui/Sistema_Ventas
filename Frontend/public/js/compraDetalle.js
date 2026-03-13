document.addEventListener("DOMContentLoaded", cargarDetalle)

async function cargarDetalle(){

    const params = new URLSearchParams(window.location.search)

    const id = params.get("id")

    const res = await fetch(`http://localhost:3000/api/compras/${id}`)

    const data = await res.json()

    const compra = data.compra
    const detalle = data.detalle

    // llenar tarjetas
    document.querySelector("#id-compra").textContent = compra.id_Compra
    document.querySelector("#proveedor").textContent = compra.RFC
    document.querySelector("#fecha").textContent = compra.Fecha
    document.querySelector("#total").textContent = "$" + compra.TotalCompra

    const tbody = document.querySelector("#tabla-detalle-compra")

    tbody.innerHTML = ""

    detalle.forEach(d => {

        const fila = document.createElement("tr")

        fila.innerHTML = `
            <td>${d.No_Serie}</td>
            <td>${d.producto}</td>
            <td>${d.descripcion}</td>
            <td>$${d.PrecioCompra}</td>
            <td>${d.Cantidad}</td>
            <td>$${d.subtotal}</td>
        `

        tbody.appendChild(fila)

    })

}