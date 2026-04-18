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
            <p>Generando modelo matemático de decaimiento para: <strong>${nombreProducto}</strong>...</p>
        </div>`;

    try {
        const res = await fetch(`${API_SIMULACION}/${noSerie}`);
        const data = await res.json();

        if (res.ok) {
            const tPedido = parseFloat(data.resultados.semanasPedido);
            const tAgotamiento = parseFloat(data.resultados.semanasAgotamiento);

            let mensajeStatus, claseAlerta, sugerenciaAdmin;

            if (tAgotamiento <= 4) {
                mensajeStatus = "🚨 ROTACIÓN CRÍTICA: AGOTAMIENTO EN MENOS DE UN MES";
                claseAlerta = "background-color: #ffe5e5; color: #d63031; border: 1px solid #ff7675;";
                sugerenciaAdmin = "El inventario actual no cubre la demanda mensual. Se requiere una orden de compra inmediata.";
            } else if (tAgotamiento > 52) {
                mensajeStatus = "💤 PRODUCTO ESTANCADO: SOBREINVENTARIO DETECTADO";
                claseAlerta = "background-color: #e1f5fe; color: #0288d1; border: 1px solid #29b6f6;";
                sugerenciaAdmin = "El stock excede la demanda anual prevista. Evaluar estrategias de promoción o liquidación.";
            } else {
                mensajeStatus = "✅ STOCK OPERABLE: FLUJO DE VENTAS ESTABLE";
                claseAlerta = "background-color: #e8f5e9; color: #2e7d32; border: 1px solid #66bb6a;";
                sugerenciaAdmin = "El ritmo de desplazamiento es saludable. Mantener el monitoreo estándar de reposición.";
            }

            const textoPedido = tPedido < 0
                ? `<span style="color:#e74c3c; font-weight:bold;">⚠️ PEDIDO URGENTE (Punto vencido)</span>`
                : `${tPedido.toFixed(2)} semanas`;

            const textoAgotamiento = tAgotamiento > 52
                ? `+52 semanas (más de 1 año)`
                : `${tAgotamiento.toFixed(2)} semanas`;

            tablaDiv.innerHTML = `
                <div style="padding: 15px; border-radius: 8px; margin-bottom: 20px; text-align: center; font-weight: bold; ${claseAlerta}">
                    ${mensajeStatus}
                </div>

                <table class="tabla-simulacion" style="width:100%; border-collapse: collapse; margin-top:10px;">
                    <thead>
                        <tr style="background:#2c3e50; color:white;">
                            <th style="padding:12px; text-align: left;">Escenario Crítico</th>
                            <th style="padding:12px;">Tiempo Estimado</th>
                            <th style="padding:12px; text-align: left;">Decisión Administrativa</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding:15px;"><b>Punto de Reorden (10 u)</b></td>
                            <td style="text-align:center;">${textoPedido}</td>
                            <td>Generar orden de reposición prioritaria</td>
                        </tr>
                        <tr>
                            <td style="padding:15px;"><b>Agotamiento Total (1 u)</b></td>
                            <td style="text-align:center;"><b>${textoAgotamiento}</b></td>
                            <td>Cierre de inventario y alerta de quiebre</td>
                        </tr>
                    </tbody>
                </table>

                <div id="contenedor-math" style="margin-top: 20px; background: #fdfdfd; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                    <p style="margin-top:0; color:#7f8c8d; font-size: 0.85em; font-weight:bold; text-transform:uppercase;">Modelo Matemático Aplicado:</p>
                    
                    <div style="font-size: 1.5em; text-align:center; margin:15px 0; color:#2c3e50; font-family: 'Times New Roman', serif;">
                        $$S(t) = ${data.stockInicial} \\cdot e^{${data.k}t}$$
                    </div>
                    
                    <div style="font-family: 'Segoe UI', Tahoma, sans-serif; font-size:0.95em; color:#34495e; border-top: 1px solid #eee; padding-top:15px; line-height: 1.8;">
                        <b style="color: #2c3e50;">Parámetros del Modelo de Decaimiento:</b><br>
                        • Stock Inicial estimado \\( S_0 \\): <b style="color: #2c3e50;">${data.stockInicial} unidades</b><br>
                        • Tasa de decaimiento \\( k \\): <b style="color: #2c3e50;">${data.k}</b><br>
                        • Tiempo: ${data.tiempo}</b><br>
                        • Variación semanal: <b style="color: #2c3e50;">${(Math.abs(data.k) * 100).toFixed(2)}%</b> del inventario disponible.<br>
                        <p style="margin-top: 10px; font-style: italic; color: #7f8c8d;">
                            <strong>Sugerencia:</strong> ${sugerenciaAdmin}
                        </p>
                    </div>
                </div>
            `;

            if (window.MathJax && window.MathJax.typesetPromise) {
                window.MathJax.typesetPromise([tablaDiv]).catch((err) => console.log("Error MathJax:", err));
            }

            generarGraficaExponencial(data.stockInicial, data.k, nombreProducto);
            seccion.scrollIntoView({ behavior: 'smooth' });

        } else {
            tablaDiv.innerHTML = `<p style="color:red; font-weight:bold;">⚠️ Error: ${data.error || "No se pudo procesar el cálculo"}</p>`;
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

    for (let t = 0; t <= 14; t++) {
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
                label: `Curva de Decaimiento: ${nombre}`,
                data: datosPuntos,
                borderColor: '#e74c3c',
                backgroundColor: 'rgba(231, 76, 60, 0.1)',
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
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: (context) => `Stock Estimado: ${context.parsed.y} u`
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad (Unidades)' }
                },
                x: {
                    title: { display: true, text: 'Tiempo (Semanas)' }
                }
            }
        }
    });
}