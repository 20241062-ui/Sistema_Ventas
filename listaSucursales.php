<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once "conexion.php";

$pagina = basename($_SERVER['PHP_SELF']);

$sql = "SELECT intid, vchnombre, vchdireccion, vchciudad, vchtelefono, vchhorario, vchlink_mapa 
        FROM tblsucursales ORDER BY vchnombre ASC";
$resultado = $conn->query($sql);
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Sucursales - Sistema de Ventas</title>
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
        <h2>Lista de sucursales</h2>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='agregarSucursal.php'">
                 Nueva sucursal
            </button>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Ciudad</th>
                        <th>Teléfono</th>
                        <th>Horario</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                <?php if ($resultado->num_rows > 0): ?>
                    <?php while ($fila = $resultado->fetch_assoc()): ?>
                        <tr>
                            <td><?= htmlspecialchars($fila['vchnombre']) ?></td>
                            <td><?= htmlspecialchars($fila['vchdireccion']) ?></td>
                            <td><?= htmlspecialchars($fila['vchciudad']) ?></td>
                            <td><?= htmlspecialchars($fila['vchtelefono']) ?></td>
                            <td><?= htmlspecialchars($fila['vchhorario']) ?></td>
                            <td>
                                <button class="guardar"
                                    onclick="window.location.href='editarSucursal.php?id=<?= urlencode($fila['intid']) ?>'">
                                    Editar
                                </button>
                                <button class="cancelar"
                                    onclick="if(confirm('¿Eliminar sucursal?')) window.location.href='eliminarSucursal.php?id=<?= urlencode($fila['intid']) ?>'">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    <?php endwhile; ?>
                <?php else: ?>
                    <tr><td colspan="6">No hay sucursales registradas.</td></tr>
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
