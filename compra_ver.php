<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include('conexion.php');


if (!isset($_GET['id'])) {
    echo "<h3>Error: No se especificó la compra.</h3>";
    exit;
}

$id_compra = $_GET['id'];

$sql = "SELECT id_Compra, RFC, Fecha, TotalCompra FROM tblcompra WHERE id_Compra = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id_compra);
$stmt->execute();
$compra = $stmt->get_result()->fetch_assoc();

if (!$compra) {
    echo "<h3>Error: Compra no encontrada.</h3>";
    exit;
}

$sql_detalle = "SELECT 
                    d.No_Serie, 
                    p.vchNombre AS producto, 
                    p.vchDescripcion AS descripcion,
                    d.Cantidad, 
                    d.PrecioCompra, 
                    (d.Cantidad * d.PrecioCompra) AS subtotal
                FROM tbldetallecompra d
                INNER JOIN tblproductos p ON d.No_Serie = p.vchNo_Serie
                WHERE d.id_Compra = ?";
$stmt_det = $conn->prepare($sql_detalle);
$stmt_det->bind_param("i", $id_compra);
$stmt_det->execute();
$detalle = $stmt_det->get_result();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Detalle de Compra<?= htmlspecialchars($compra['id_Compra']) ?></title>
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
        <h2>Detalle de la Compra <?= htmlspecialchars($compra['id_Compra']) ?></h2>

        <div class="cards">
            <div class="card">
                <h3>ID Compra</h3>
                <p class="big"><?= htmlspecialchars($compra['id_Compra']) ?></p>
            </div>
            <div class="card">
                <h3>Proveedor (RFC)</h3>
                <p class="big"><?= htmlspecialchars($compra['RFC']) ?></p>
            </div>
            <div class="card">
                <h3>Fecha</h3>
                <p class="big"><?= htmlspecialchars($compra['Fecha']) ?></p>
            </div>
            <div class="card success">
                <h3>Total Compra</h3>
                <p class="big">$<?= number_format($compra['TotalCompra'], 2) ?></p>
            </div>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>No. Serie</th>
                        <th>Producto</th>
                        <th>Descripción</th>
                        <th>Precio Compra</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if($detalle->num_rows > 0): ?>
                        <?php while($fila = $detalle->fetch_assoc()): ?>
                            <tr>
                                <td><?= htmlspecialchars($fila['No_Serie']) ?></td>
                                <td><?= htmlspecialchars($fila['producto']) ?></td>
                                <td><?= htmlspecialchars($fila['descripcion']) ?></td>
                                <td>$<?= number_format($fila['PrecioCompra'], 2) ?></td>
                                <td><?= htmlspecialchars($fila['Cantidad']) ?></td>
                                <td>$<?= number_format($fila['subtotal'], 2) ?></td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No hay productos registrados en esta compra.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='compra.php'">Volver al listado</button>
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
