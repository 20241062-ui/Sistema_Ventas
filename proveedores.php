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

if ($busqueda != "") {
    $sql = "SELECT * FROM tblproveedor 
            WHERE vchNombre LIKE ? 
               OR vchApellido_Paterno LIKE ? 
               OR vchApellido_Materno LIKE ? 
               OR vchRazon_Social LIKE ? 
               OR vchCorreo LIKE ? 
            ORDER BY vchNombre ASC";
    $stmt = $conn->prepare($sql);
    $param = "%$busqueda%";
    $stmt->bind_param("sssss", $param, $param, $param, $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();
} else {
    $sql = "SELECT * FROM tblproveedor ORDER BY vchNombre ASC";
    $resultado = $conn->query($sql);
}

$totalProveedores = $conn->query("SELECT COUNT(*) AS total FROM tblproveedor")->fetch_assoc()['total'];
$conDeuda = 0; 
$sinDeuda = $totalProveedores - $conDeuda; 
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Proveedores - Sistema de Ventas</title>
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
        <h2>Proveedores registrados</h2>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='proveedor_nuevo.php'">Nuevo proveedor</button>

            <form method="GET" action="proveedores.php" class="productos-buscar">
                <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" placeholder="Buscar proveedor...">
                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>
                <?php if ($busqueda != ""): ?>
                    <button type="button" class="btn-superior limpiar" onclick="window.location.href='proveedores.php'">Limpiar</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>RFC</th>
                        <th>Nombre Completo</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Razón Social</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultado && $resultado->num_rows > 0): ?>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr>
                                <td><?= htmlspecialchars($fila['vchRFC']) ?></td>
                                <td><?= htmlspecialchars($fila['vchNombre'] . " " . $fila['vchApellido_Paterno'] . " " . $fila['vchApellido_Materno']) ?></td>
                                <td><?= htmlspecialchars($fila['vchTelefono']) ?></td>
                                <td><?= htmlspecialchars($fila['vchCorreo']) ?></td>
                                <td><?= htmlspecialchars($fila['vchRazon_Social']) ?></td>
                                <td>
                                    <button class="guardar" onclick="window.location.href='proveedor_actualizar.php?id=<?= urlencode($fila['vchRFC']) ?>'">Editar</button>
                                    <button class="cancelar" onclick="if(confirm('¿Seguro de eliminar este proveedor?')) window.location.href='proveedor_eliminar.php?id=<?= urlencode($fila['vchRFC']) ?>'">Eliminar</button>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No se encontraron proveedores.</td></tr>
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
