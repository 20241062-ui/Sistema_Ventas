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
    $sql = "SELECT * FROM tblmarcas 
            WHERE intid_Marca LIKE ? OR vchNombre LIKE ?
            ORDER BY intid_Marca ASC";
    $stmt = $conn->prepare($sql);
    $param = "%$busqueda%";
    $stmt->bind_param("ss", $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();
} else {
    $sql = "SELECT * FROM tblmarcas ORDER BY intid_Marca ASC";
    $resultado = $conn->query($sql);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Marcas - Sistema de Ventas</title>
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
            <h2>Marcas registradas</h2>

            <div class="productos-superior">
                <button class="btn-superior" onclick="window.location.href='marca_nueva.php'">Nueva marca</button>

                <form method="GET" action="marcas.php" class="productos-buscar">
                    <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" placeholder="Buscar por ID o nombre...">
                    <button type="submit" class="btn-superior buscar">🔍 Buscar</button>
                    <?php if ($busqueda != ""): ?>
                        <button type="button" class="btn-superior limpiar" onclick="window.location.href='marcas.php'">Limpiar</button>
                    <?php endif; ?>
                </form>
            </div>

            <div class="panel table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Marca</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if ($resultado && $resultado->num_rows > 0): ?>
                            <?php while ($fila = $resultado->fetch_assoc()): ?>
                                <tr>
                                    <td><?= htmlspecialchars($fila['intid_Marca']) ?></td>
                                    <td><?= htmlspecialchars($fila['vchNombre']) ?></td>
                                    <td>
                                        <button class="guardar" onclick="window.location.href='marca_actualizar.php?id=<?= urlencode($fila['intid_Marca']) ?>'">Editar</button>
                                        <button class="cancelar" onclick="if(confirm('¿Seguro de eliminar esta marca?')) window.location.href='marca_eliminar.php?id=<?= urlencode($fila['intid_Marca']) ?>'">Eliminar</button>
                                    </td>
                                </tr>
                            <?php endwhile; ?>
                        <?php else: ?>
                            <tr><td colspan="3">No se encontraron resultados.</td></tr>
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
