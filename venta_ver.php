<?php
ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include('conexion.php');

if (!isset($_GET['id'])) {
    echo "<h3>Error: No se especificó la venta.</h3>";
    exit;
}

$id_venta = $_GET['id'];

/* Llamar procedimiento almacenado */
$stmt = $conn->prepare("CALL sp_ver_detalle_venta(?)");
$stmt->bind_param("i", $id_venta);
$stmt->execute();

/* Primer resultado: datos generales */
$result_general = $stmt->get_result();
$venta = $result_general->fetch_assoc();

if (!$venta) {
    echo "<h3>Error: Venta no encontrada.</h3>";
    $stmt->close();
    exit;
}

/* Segundo resultado: detalle */
$stmt->next_result();
$result_detalle = $stmt->get_result();
$detalle_array = $result_detalle->fetch_all(MYSQLI_ASSOC);

$stmt->close();

/* Calcular total de items */
$total_items = 0;
foreach ($detalle_array as $fila) {
    $total_items += $fila['Cantidad'];
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Detalle de Venta #<?= htmlspecialchars($venta['id_Ventas']) ?></title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php"><img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo"></a>
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
        <h2> Detalle de la Venta <?= htmlspecialchars($venta['id_Ventas']) ?></h2>

        <div class="cards">
            <div class="card">
                <h3>Cliente</h3>
                <p class="big"><?= htmlspecialchars($venta['nombre_cliente'] ?: 'N/A') ?></p>
            </div>
            <div class="card">
                <h3>Fecha Venta</h3>
                <p class="big"><?= htmlspecialchars($venta['Fecha_Venta']) ?></p>
            </div>
            <div class="card">
                <h3>Total Productos</h3>
                <p class="big"><?= htmlspecialchars($total_items) ?></p>
            </div>
            <div class="card success">
                <h3>Total Venta</h3>
                <p class="big">$<?= number_format($venta['Total_Venta'], 2) ?></p>
            </div>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>No. Serie</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio Unitario</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if(!empty($detalle_array)): ?>
                        <?php foreach($detalle_array as $fila): ?>
                            <tr>
                                <td><?= htmlspecialchars($fila['No_Serie']) ?></td>
                                <td><?= htmlspecialchars($fila['producto']) ?></td>
                                <td><?= htmlspecialchars($fila['descripcion']) ?></td>
                                <td>$<?= number_format($fila['PrecioUnitario'], 2) ?></td>
                                <td><?= htmlspecialchars($fila['Cantidad']) ?></td>
                                <td>$<?= number_format($fila['Subtotal'], 2) ?></td>
                            </tr>
                        <?php endforeach; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No hay productos registrados en esta venta.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='ventas.php'">Volver al listado</button>
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
