<?php
// 1. SEGURIDAD Y CONEXIÓN
ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

// 2. CONSULTAS SQL PARA REPORTES

// A. Obtener los 5 productos más vendidos
$sqlTopProductos = "
    SELECT p.vchNombre, SUM(dv.Cantidad) as total_vendido
    FROM tbldetalleventa dv
    JOIN tblproductos p ON dv.No_Serie = p.vchNo_Serie
    GROUP BY p.vchNombre
    ORDER BY total_vendido DESC
    LIMIT 5
";
$resTop = $conn->query($sqlTopProductos);

$prodLabels = [];
$prodData = [];

while($row = $resTop->fetch_assoc()){
    $prodLabels[] = $row['vchNombre']; // Nombres para la gráfica
    $prodData[] = $row['total_vendido']; // Cantidades para la gráfica
}

// B. Obtener ventas por mes (Año actual)
$sqlVentasMes = "
    SELECT MONTHNAME(Fecha_Venta) as mes, SUM(Total_Venta) as total
    FROM tblventas
    WHERE YEAR(Fecha_Venta) = YEAR(CURDATE())
    GROUP BY MONTH(Fecha_Venta)
";
$resMes = $conn->query($sqlVentasMes);

$mesLabels = [];
$mesData = [];

while($row = $resMes->fetch_assoc()){
    $mesLabels[] = $row['mes'];
    $mesData[] = $row['total'];
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Reportes - Sistema de ventas</title>
    <link rel="stylesheet" href="estiloAdmin.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <style>
        /* Estilos específicos para esta página de reportes */
        .contenedor-reportes {
            display: grid;
            grid-template-columns: 1fr 1fr; /* Dos columnas */
            gap: 20px;
            margin-top: 20px;
        }
        .tarjeta-grafica {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .btn-volver {
            background-color: #6c757d;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
            margin-bottom: 20px;
        }
        @media (max-width: 768px) {
            .contenedor-reportes { grid-template-columns: 1fr; }
        }
    </style>
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
        </a>
        <nav class="nav-admin">
            <a href="menuAdministrador.php">Productos</a>
            <a href="ventas.php">Ventas</a>
            <a href="compra.php">Compras</a>
            <a href="categorias.php" class="active">Categorías</a>
            <a href="marcas.php">Marcas</a>
            <a href="proveedores.php">Proveedores</a>
            <a href="listaSucursales.php">Sucursales</a>
            <a href="informacionEmpresa.php">Información</a>
            <a href="clientes.php">Clientes</a>
            <a href="preguntasFrecuentes.php">FAQ</a>
            <a href="contactoLista.php">Contacto</a>
            <a href="usuarios.php">Usuarios</a>
        </nav>
        <div class="user-menu">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" alt="Perfil" class="profileicon">
        </div>
    </div>
</header>

<div class="container">
    <main class="main">
        <br>
        <a href="ventas.php" class="btn-volver">← Volver a Lista de Ventas</a>
        
        <h2>Tablero de Reportes y Estadísticas</h2>

        <div class="contenedor-reportes">
            
            <div class="tarjeta-grafica">
                <h3>🏆 Top 5 Productos Más Vendidos</h3>
                <canvas id="chartProductos"></canvas>
            </div>

            <div class="tarjeta-grafica">
                <h3>📈 Ingresos por Mes (Año Actual)</h3>
                <canvas id="chartMeses"></canvas>
            </div>

        </div>
    </main>
</div>

<script>
    // 1. Configuración Gráfica de Productos (Pastel / Pie)
    const ctxProd = document.getElementById('chartProductos');
    
    // Pasamos los datos de PHP a JS usando json_encode
    const dataProductos = {
        labels: <?php echo json_encode($prodLabels); ?>,
        datasets: [{
            label: 'Unidades Vendidas',
            data: <?php echo json_encode($prodData); ?>,
            backgroundColor: [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
            ],
            hoverOffset: 4
        }]
    };

    new Chart(ctxProd, {
        type: 'doughnut', // Tipo dona (puedes cambiar a 'pie' o 'bar')
        data: dataProductos,
    });


    // 2. Configuración Gráfica de Ventas Mensuales (Barras)
    const ctxMes = document.getElementById('chartMeses');
    
    const dataMeses = {
        labels: <?php echo json_encode($mesLabels); ?>,
        datasets: [{
            label: 'Ingresos ($ MXN)',
            data: <?php echo json_encode($mesData); ?>,
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            borderWidth: 1
        }]
    };

    new Chart(ctxMes, {
        type: 'bar', // Tipo barras verticales
        data: dataMeses,
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
</script>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>