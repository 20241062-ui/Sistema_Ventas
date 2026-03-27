const API_SIMULACION = "https://sistemaventasback.vercel.app/api/analisis/simulacion";

async function ejecutarPrediccion(noSerie, nombreProducto) {
    const seccion = document.getElementById('seccionSimulacion');
    const tablaDiv = document.getElementById('tablaResultados');

    if (!noSerie || noSerie === 'undefined') {
        console.error("Error: NoSerie no definido");
        return;
    }

    seccion.style.display = 'block';
    tablaDiv.innerHTML = `
        <div style="text-align:center; padding:20px;">
            <p>Calculando modelo exponencial para: <strong>${nombreProducto}</strong>...</p>
        </div>`;

    try {
        const res = await fetch(`${API_SIMULACION}/${noSerie}`);
        const data = await res.json();

        if (res.ok) {
            tablaDiv.innerHTML = `
                <table class="tabla-simulacion" style="width:100%; border-collapse: collapse; margin-top:10px;">
                    <thead>
                        <tr style="background:#2c3e50; color:white;">
                            <th style="padding:10px;">Escenario Crítico</th>
                            <th>Tiempo (Semanas)</th>
                            <th>Decisión Administrativa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #ddd;">
                            <td style="padding:10px;">Punto de Reorden (10 u)</td>
                            <td><strong>${data.resultados.semanasPedido}</strong></td>
                            <td>Generar pedido automático</td>
                        </tr>
                        <tr>
                            <td style="padding:10px;">Agotamiento (1 u)</td>
                            <td><strong>${data.resultados.semanasAgotamiento}</strong></td>
                            <td style="color:red; font-weight:bold;">Alerta Crítica de Quiebre</td>
                        </tr>
                    </tbody>
                </table>
                <div style="margin-top: 15px; background: #f8f9fa; padding: 12px; border-left: 4px solid #2c3e50; font-family: monospace;">
                    <strong>Modelo Matemático:</strong> S(t) = ${data.stockInicial}e^{${data.k}t}<br>
                    <strong>Tasa de ventas:</strong> ${(Math.abs(data.k) * 100).toFixed(2)}% de inventario/semana.
                </div>
            `;

            generarGraficaExponencial(data.stockInicial, data.k, nombreProducto);
            seccion.scrollIntoView({ behavior: 'smooth' });

        } else {
            tablaDiv.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ Error: ${data.error || "No se pudo procesar"}</p>`;
        }
    } catch (error) {
        console.error("Error en la simulación:", error);
        tablaDiv.innerHTML = "<p style='color:red;'>❌ Error de conexión con el motor de cálculo.</p>";
    }
}

function generarGraficaExponencial(C, k, nombre) {
    const canvas = document.getElementById('graficaStock');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const etiquetasSemanas = [];
    const datosPuntos = [];

    for (let t = 0; t <= 12; t++) {
        etiquetasSemanas.push("Sem. " + t);
        const stockEnT = C * Math.exp(k * t);
        datosPuntos.push(stockEnT > 0 ? stockEnT.toFixed(2) : 0);
    }

    if (window.miGrafica) {
        window.miGrafica.destroy();
    }

    window.miGrafica = new Chart(ctx, {
        type: 'line',
        data: {
            labels: etiquetasSemanas,
            datasets: [{
                label: `Proyección de Stock: ${nombre}`,
                data: datosPuntos,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.2)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#2c3e50'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        label: (context) => `Unidades estimadas: ${context.parsed.y}`
                    }
                }
            },
            scales: {
                y: { 
                    beginAtZero: true,
                    title: { display: true, text: 'Unidades Disponibles' }
                }
            }
        }
    });
}