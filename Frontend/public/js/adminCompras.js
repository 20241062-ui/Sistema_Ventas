document.addEventListener("DOMContentLoaded", cargarCompras)

async function cargarCompras(){

    try{

        const res = await fetch("http://localhost:3000/api/compras")

        const data = await res.json()

        const tabla = document.querySelector("#tabla-compras-body")

        tabla.innerHTML = ""

        data.compras.forEach(c => {

            const fila = document.createElement("tr")

            fila.innerHTML = `
                <td>${c.id_Compra}</td>
                <td>${c.RFC}</td>
                <td>$${c.TotalCompra}</td>
                <td>${c.Fecha}</td>
                <td>
                    <button class="guardar" onclick="verCompra(${c.id_Compra})">
                        Ver
                    </button>
                </td>
            `

            tabla.appendChild(fila)

        })

        document.querySelector("#total-compras").textContent = data.total

    }catch(error){

        console.error("Error cargando compras:",error)

    }

}


function verCompra(id){

    window.location.href = `detalle_compra.html?id=${id}`

}