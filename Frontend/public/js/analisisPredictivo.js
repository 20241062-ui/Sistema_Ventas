// URL de tu API en Vercel
const API_SIMULACION = "https://sistemaventasback.vercel.app/api/analisis/simulacion";

async function abrirSimulacion() {
    const seccion = document.getElementById('seccionSimulacion');
    const tablaDiv = document.getElementById('tablaResultados');

    // Mostramos la sección
    seccion.style.display = 'block';
    tablaDiv.innerHTML = "<p>Procesando modelo matemático...</p>";

    try {
        const res = await fetch(API_SIMULACION);
        const data = await res.json();

        if (res.ok) {
            // 1. Renderizar la Tabla (Exigencia de la Rúbrica)
            tablaDiv.innerHTML = `
                <table class="tabla-simulacion">
                    <thead>
                        <tr>
                            <th>Escenario Critico</th>
                            <th>Tiempo (Semanas)</th>
                            <th>Decisión Administrativa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Punto de Reorden (10 u)</td>
                            <td><strong>${data.resultados.semanasPedido}</strong></td>
                            <td>Generar pedido automático al proveedor</td>
                        </tr>
                        <tr>
                            <td>Agotamiento de Stock (1 u)</td>
                            <td><strong>${data.resultados.semanasAgotamiento}</strong></td>
                            <td>Cierre de inventario / Alerta Crítica</td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-top: 15px; background: #f8f9fa; padding: 10px; border-left: 4px solid #2c3e50;">
                    <small><strong>Modelo Generado:</strong> S(t) = ${data.C}e^{${data.k}t}</small><br>
                    <small><strong>Interpretación:</strong> La tasa de decrecimiento es del ${(Math.abs(data.k) * 100).toFixed(2)}% semanal.</small>
                </div>
            `;

            // 2. Renderizar la Gráfica
            generarGraficaExponencial(data.C, data.k);

            // Desplazar la vista al reporte
            seccion.scrollIntoView({ behavior: 'smooth' });

        } else {
            tablaDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error("Error en la simulación:", error);
        tablaDiv.innerHTML = "<p style='color:red;'>No se pudo conectar con el motor de cálculo.</p>";
    }
}

function generarGraficaExponencial(C, k) {
    const ctx = document.getElementById('graficaStock').getContext('2d');

    // Generar puntos para la curva (de semana 0 a 14 para ver el agotamiento)
    const etiquetasSemanas = [];
    const datosPuntos = [];

    for (let t = 0; t <= 14; t++) {
        etiquetasSemanas.push("Semana " + t);
        const stockEnT = C * Math.exp(k * t);
        datosPuntos.push(stockEnT.toFixed(2));
    }

    // Si ya existe una gráfica previa, la destruimos para evitar solapamiento
    if (window.miGrafica) {
        window.miGrafica.destroy();
    }

    window.miGrafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetasSemanas,
            datasets: [{
                label: 'Curva de Decrecimiento de Stock (iPhone 15 Pro)',
                data: datosPuntos,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.3,
                pointRadius: 4,
                pointBackgroundColor: '#2c3e50'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad de Unidades (S)' }
                },
                x: {
                    title: { display: true, text: 'Tiempo (t) en Semanas' }
                }
            }
        }
    });
}