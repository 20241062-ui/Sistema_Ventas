<?php
ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

$busqueda = isset($_GET['buscar']) ? trim($_GET['buscar']) : "";

// Consultas de estadísticas
$totalUsuarios = $conn->query("SELECT COUNT(*) AS total FROM tblusuario")->fetch_assoc()['total'];
$activos = $conn->query("SELECT COUNT(*) AS activos FROM tblusuario WHERE Estado=1")->fetch_assoc()['activos'];
$inactivos = $conn->query("SELECT COUNT(*) AS inactivos FROM tblusuario WHERE Estado=0")->fetch_assoc()['inactivos'];

$sql_base = "SELECT id_usuario, vchnombre, vchapellido, vchcorreo, vchRol, Estado FROM tblusuario";

if ($busqueda != "") {
    $sql = $sql_base . " WHERE (vchnombre LIKE ? OR vchapellido LIKE ? OR vchcorreo LIKE ? OR vchRol LIKE ?) ORDER BY id_usuario ASC";
    $stmt = $conn->prepare($sql);
    $param = "%$busqueda%";
    $stmt->bind_param("ssss", $param, $param, $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();
} else {
    $sql = $sql_base . " ORDER BY id_usuario ASC";
    $resultado = $conn->query($sql);
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Gestión de Usuarios - Admin</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
    <style>
        /* Estilo extra para el botón eliminar */
        .btn-eliminar {
            background-color: #dc3545;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: 0.3s;
        }
        .btn-eliminar:hover {
            background-color: #a71d2a;
        }
        .acciones-flex {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }
    </style>
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
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" class="profileicon">
            <div class="menu">
                <a href="perfilAdmin.php">Mi cuenta</a>
                <a href="cerrar_sesion.php">Cerrar Sesión</a>
            </div>
        </div>
    </div>
</header>

<div class="container">
    <main class="main">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Usuarios del Sistema</h2>
        </div>

        <div class="cards">
            <div class="card"><h3>Total</h3><p class="big"><?= $totalUsuarios ?></p></div>
            <div class="card success"><h3>Activos</h3><p class="big"><?= $activos ?></p></div>
            <div class="card warning"><h3>Inactivos</h3><p class="big"><?= $inactivos ?></p></div>
        </div>

        <div class="productos-superior">
            <button type="button" class="btn-superior" onclick="window.location.href='usuario_nuevo.php'">Nuevo Usuario</button>
            <form method="GET" class="productos-buscar">
                <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" placeholder="Buscar usuario...">
                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>
            </form>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php if ($resultado && $resultado->num_rows > 0): ?>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr class="<?= $fila['Estado'] == 0 ? 'inactivo' : '' ?>">
                                <td><?= $fila['id_usuario'] ?></td>
                                <td><?= htmlspecialchars($fila['vchnombre'] . " " . $fila['vchapellido']) ?></td>
                                <td><?= htmlspecialchars($fila['vchcorreo']) ?></td>
                                <td><strong><?= $fila['vchRol'] ?></strong></td>
                                <td><?= $fila['Estado'] == 1 ? 'Activo' : 'Inactivo' ?></td>
                                <td class="acciones-flex">
                                    <button class="guardar" onclick="window.location.href='usuario_actualizar.php?id=<?= $fila['id_usuario'] ?>'">Editar</button>
                                    
                                    <?php if ($fila['id_usuario'] != $_SESSION['usuario_id']): ?>
                                        <button class="<?= $fila['Estado'] == 1 ? 'cancelar' : 'activar' ?>" 
                                                onclick="window.location.href='usuario_estado.php?id=<?= $fila['id_usuario'] ?>&estado=<?= $fila['Estado'] == 1 ? 0 : 1 ?>'">
                                            <?= $fila['Estado'] == 1 ? 'Baja' : 'Activar' ?>
                                        </button>

                                        <button class="btn-eliminar" 
                                                onclick="if(confirm('¿ESTÁS SEGURO? Esta acción eliminará al usuario PERMANENTEMENTE de la base de datos.')) 
                                                window.location.href='usuario_eliminar.php?id=<?= $fila['id_usuario'] ?>'">
                                            Eliminar
                                        </button>
                                    <?php else: ?>
                                       
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="6">No hay registros.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </main>
</div>
</body>
</html>