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

    $sql = "SELECT * FROM tblinformacion 
            WHERE intid LIKE ? OR vchtitulo LIKE ?
            ORDER BY intid ASC";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Error en prepare: " . $conn->error);
    }

    $param = "%$busqueda%";
    $stmt->bind_param("ss", $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();

} else {
    $sql = "SELECT * FROM tblinformacion ORDER BY intid ASC";
    $resultado = $conn->query($sql);

    if (!$resultado) {
        die("Error en query: " . $conn->error);
    }
}

// Obtener estadísticas para las tarjetas
$totalInformacion = $conn->query("SELECT COUNT(*) AS total FROM tblinformacion")->fetch_assoc()['total'];
$activa = $conn->query("SELECT COUNT(*) AS activa FROM tblinformacion WHERE Estado = 1")->fetch_assoc()['activa'];
$inactiva = $conn->query("SELECT COUNT(*) AS inactiva FROM tblinformacion WHERE Estado = 0")->fetch_assoc()['inactiva'];
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Información de la Empresa - Sistema de ventas</title>
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
    <h2>Información de la Empresa</h2>
    
        <div class="cards">
            <div class="card">
                <h3>Total información</h3>
                <p class="big"><?= htmlspecialchars($totalInformacion) ?></p>
            </div>
            <div class="card success">
                <h3>Activas</h3>
                <p class="big"><?= htmlspecialchars($activa) ?></p>
            </div>
            <div class="card warning">
                <h3>Inactivas</h3>
                <p class="big"><?= htmlspecialchars($inactiva) ?></p>
            </div>
        </div>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='informacionNueva.php'">Nueva información</button>

            <form method="GET" action="informacionEmpresa.php" class="productos-buscar">
                <input type="search" 
                       name="buscar" 
                       value="<?= htmlspecialchars($busqueda) ?>" 
                       placeholder="Buscar por ID o título..."> 
                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>

                <?php if ($busqueda != ""): ?>
                    <button type="button" class="btn-superior limpiar" onclick="window.location.href='informacionEmpresa.php'">Limpiar</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Título</th>
                        <th>Contenido</th>
                        <th>Estado</th>
                        <th>Fecha Modificación</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultado && $resultado->num_rows > 0): ?>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr class="<?= $fila['Estado'] == 0 ? 'inactivo' : '' ?>">
                                <td><?= htmlspecialchars($fila['intid']) ?></td>
                                <td><?= htmlspecialchars($fila['vchtitulo']) ?></td>
                                <td class="descripcion"><?= htmlspecialchars($fila['vchcontenido']) ?></td>
                                <td><?= $fila['Estado'] == 1 ? 'Activo' : 'Inactivo' ?></td>
                                <td><?= htmlspecialchars($fila['fecha_actualizacion']) ?></td>
                                <td>
                                    <button class="guardar" onclick="window.location.href='informacionActualizar.php?id=<?= urlencode($fila['intid']) ?>'">
                                        Editar
                                    </button>

                                    <?php if ($fila['Estado'] == 1): ?>
                                        <button class="cancelar" 
                                            onclick="if(confirm('¿Quieres desactivar esta información?')) window.location.href='informacionBaja.php?id=<?= urlencode($fila['intid']) ?>&Estado=0'">
                                            Baja
                                        </button>
                                    <?php else: ?>
                                        <button class="activar" 
                                            onclick="if(confirm('¿Quieres activar esta información?')) window.location.href='informacionBaja.php?id=<?= urlencode($fila['intid']) ?>&Estado=1'">
                                            Activar
                                        </button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No se encontraron resultados.</td></tr>
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
