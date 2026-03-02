<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';

$pagina = basename($_SERVER['PHP_SELF']);
$busqueda = isset($_GET['buscar']) ? trim($_GET['buscar']) : "";

/* Llamada al procedimiento almacenado */
$stmt = $conn->prepare("CALL sp_listar_ventas(?)");
$stmt->bind_param("s", $busqueda);
$stmt->execute();
$resultado = $stmt->get_result();
$stmt->close();

/* Total de ventas */
$totalVentas = $conn->query("SELECT COUNT(*) AS total FROM tblventas")->fetch_assoc()['total'];

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Ventas - Sistema de ventas</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
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

            <div class="menu">
                <?php if(isset($_SESSION['usuario_id'])): ?>
                    <a href="perfilAdmin.php">Mi cuenta</a>
                    <a href="index.php">Inicio</a>
                    <a href="cerrar_sesion.php">Cerrar Sesión</a>
                <?php else: ?>
                    <a href="login.html">Iniciar sesión</a>
                    <a href="signup.html">Registrarse</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</header>

<div class="container">
    <main class="main">
        <h2>Registro de ventas</h2>

        <div class="cards">
            <div class="card">
                <h3>Total de ventas</h3>
                <p class="big"><?= htmlspecialchars($totalVentas) ?></p>
            </div>
        </div>

        <div class="productos-superior">
            <form method="GET" action="ventas.php" class="productos-buscar">
                <input type="search" 
                       name="buscar"
                       value="<?= htmlspecialchars($busqueda) ?>"
                       placeholder="Buscar por ID o nombre del cliente...">

                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>

                <?php if ($busqueda != ""): ?>
                    <button type="button" class="btn-superior limpiar" onclick="window.location.href='ventas.php'">Limpiar</button>
                <?php endif; ?>
            </form>
            <div style="margin-left: 15px;">
                <a href="reportes_ventas.php" class="btn-superior" style="background-color: #28a745; text-decoration: none; display: inline-block; text-align: center;">
                    Ver Reportes y Gráficas
                </a>
            </div>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th># Venta</th>
                        <th>Cliente</th>
                        <th>Cantidad productos</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>

<?php if ($resultado && $resultado->num_rows > 0): ?>
    <?php while ($venta = $resultado->fetch_assoc()): ?>
                    <tr>
                        <td>V-<?= htmlspecialchars($venta['id_Ventas']) ?></td>
                        <td><?= htmlspecialchars($venta['nombre_cliente']) ?></td>
                        <td><?= htmlspecialchars($venta['Items']) ?></td>
                        <td>$<?= number_format($venta['Total_Venta'], 2) ?></td>
                        <td><?= htmlspecialchars($venta['Fecha_Venta']) ?></td>
                        <td>Completada</td>
                        <td>
                            <button class="guardar" onclick="window.location.href='venta_ver.php?id=<?= urlencode($venta['id_Ventas']) ?>'">Ver</button>
                        </td>
                    </tr>
    <?php endwhile; ?>
<?php else: ?>
                    <tr>
                        <td colspan="7">No se encontraron ventas registradas.</td>
                    </tr>
<?php endif; ?>

                </tbody>
            </table>
        </div>

    </main>
</div>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
