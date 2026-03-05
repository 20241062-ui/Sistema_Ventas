<?php
ini_set('session.cookie_lifetime', 0);
session_start();

// Verificamos sesión y rol de administrador
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

$pagina = basename($_SERVER['PHP_SELF']);
$busqueda = isset($_GET['buscar']) ? trim($_GET['buscar']) : "";

// 1. CONSULTAS DE ESTADÍSTICAS (Ahora en tblcliente)
$totalClientes = $conn->query("SELECT COUNT(*) AS total FROM tblcliente")->fetch_assoc()['total'];
$activos = $conn->query("SELECT COUNT(*) AS activos FROM tblcliente WHERE Estado=1")->fetch_assoc()['activos'];
$inactivos = $conn->query("SELECT COUNT(*) AS inactivos FROM tblcliente WHERE Estado=0")->fetch_assoc()['inactivos'];

// 2. CONSULTA BASE PARA LA TABLA
// Ajustamos nombres de columnas: intid_Cliente, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo
$sql_base = "SELECT intid_Cliente, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, Estado 
             FROM tblcliente";

if ($busqueda != "") 
{
    // Búsqueda ajustada a los nuevos campos de apellido
    $sql = $sql_base . " WHERE (vchNombre LIKE ? OR vchApellido_Paterno LIKE ? OR vchApellido_Materno LIKE ? OR vchCorreo LIKE ?) ORDER BY intid_Cliente ASC";

    $stmt = $conn->prepare($sql);
    $param = "%$busqueda%";
    $stmt->bind_param("ssss", $param, $param, $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();

} else {
    $sql = $sql_base . " ORDER BY intid_Cliente ASC";
    $resultado = $conn->query($sql);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Clientes - Sistema de ventas</title>
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
                <a href="perfilAdmin.php">Mi cuenta</a>
                <a href="index.php">Inicio</a>
                <a href="cerrar_sesion.php">Cerrar Sesión</a>
            </div>
        </div>
    </div>
</header>

<div class="container">
    <main class="main">
        <h2>Clientes registrados</h2>

        <div class="cards">
            <div class="card">
                <h3>Total clientes</h3>
                <p class="big"><?= htmlspecialchars($totalClientes) ?></p>
            </div>
            <div class="card success">
                <h3>Activos</h3>
                <p class="big"><?= htmlspecialchars($activos) ?></p>
            </div>
            <div class="card warning">
                <h3>Inactivos</h3>
                <p class="big"><?= htmlspecialchars($inactivos) ?></p>
            </div>
        </div>

        <div class="productos-superior">
            <form method="GET" action="clientes.php" class="productos-buscar">
                <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" placeholder="Buscar por nombre, apellidos o correo...">
                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>
                <?php if ($busqueda != ""): ?>
                    <button type="button" class="btn-superior limpiar" onclick="window.location.href='clientes.php'">Limpiar</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellidos</th>
                        <th>Correo Electrónico</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultado && $resultado->num_rows > 0): ?>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr class="<?= $fila['Estado'] == 0 ? 'inactivo' : '' ?>">
                                <td><?= htmlspecialchars($fila['intid_Cliente']) ?></td>
                                <td><?= htmlspecialchars($fila['vchNombre']) ?></td>
                                <td><?= htmlspecialchars($fila['vchApellido_Paterno'] . " " . $fila['vchApellido_Materno']) ?></td>
                                <td><?= htmlspecialchars($fila['vchCorreo']) ?></td>
                                <td><?= $fila['Estado'] == 1 ? 'Activo' : 'Inactivo' ?></td>
                                <td>
                                    <?php if ($fila['Estado'] == 1): ?>
                                        <button class="cancelar" onclick="if(confirm('¿Desactivar este cliente?')) window.location.href='clienteBaja.php?id=<?= urlencode($fila['intid_Cliente']) ?>&estado=0'">
                                            Baja
                                        </button>
                                    <?php else: ?>
                                        <button class="activar" onclick="if(confirm('¿Activar este cliente?')) window.location.href='clienteBaja.php?id=<?= urlencode($fila['intid_Cliente']) ?>&estado=1'">
                                            Activar
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr>
                            <td colspan="6">No se encontraron clientes registrados.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>
</div>

<footer>
    <div class="linksFooter">  
        <a>© 2026 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>