<?php
ini_set('session.cookie_lifetime', 0);
session_start();

// Verificamos sesión y rol de administrador
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if (!isset($_GET['id'])) {
    die("ID de usuario no proporcionado");
}

$id = $_GET['id'];

// 1. OBTENER DATOS DEL USUARIO
$id = $_GET['id'];
$sql = "SELECT id_usuario, vchnombre, vchapellido, vchcorreo, vchRol, vchpassword FROM tblusuario WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();

// Definimos los roles según tu ENUM en el SQL
$rolesDisponibles = ['Administrador', 'Vendedor', 'Encargado'];

if (!$usuario) {
    die("Usuario no encontrado");
}

// 2. PROCESAR ACTUALIZACIÓN
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST['vchnombre']);
    $apellido = trim($_POST['vchapellido']);
    $correo = trim($_POST['vchcorreo']);
    $rol = $_POST['vchRol'];
    $nuevaContra = $_POST['vchpassword'];

    // Lógica de contraseña: Si está vacía, mantenemos la anterior (hash)
    if (empty($nuevaContra)) {
        $passwordFinal = $usuario['vchpassword'];
    } else {
        // Si escribió algo, lo encriptamos
        $passwordFinal = password_hash($nuevaContra, PASSWORD_BCRYPT);
    }

    try {
        $sqlUpdate = "UPDATE tblusuario SET vchnombre = ?, vchapellido = ?, vchcorreo = ?, vchRol = ?, vchpassword = ? WHERE id_usuario = ?";
        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param("sssssi", $nombre, $apellido, $correo, $rol, $passwordFinal, $id);
        
        if ($stmtUpdate->execute()) {
            echo "<script>alert('Usuario actualizado correctamente'); window.location.href = 'usuarios.php';</script>";
            exit;
        }
    } catch (mysqli_sql_exception $e) {
        echo "<script>alert('Error: El correo ya podría estar en uso por otro usuario.');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Usuario - Admin</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php"><img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" class="logo"></a>
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

    <form class="panelP-formularioProductos" method="POST">
        <h2>Editar Datos de Usuario</h2>

        <label>ID Usuario:</label>
        <input type="text" value="<?= $usuario['id_usuario'] ?>" readonly style="background-color: #eee;">

        <label>Nombre(s):</label>
        <input type="text" name="vchnombre" value="<?= htmlspecialchars($usuario['vchnombre']) ?>" required>

        <label>Apellido(s):</label>
        <input type="text" name="vchapellido" value="<?= htmlspecialchars($usuario['vchapellido']) ?>" required>

        <label>Correo Electrónico:</label>
        <input type="email" name="vchcorreo" value="<?= htmlspecialchars($usuario['vchcorreo']) ?>" required>

        <label>Rol del Sistema:</label>
        <select name="vchRol" required>
            <?php foreach($rolesDisponibles as $rol): ?>
                <option value="<?= $rol ?>" <?= ($usuario['vchRol'] == $rol) ? 'selected' : '' ?>>
                    <?= $rol ?>
                </option>
            <?php endforeach; ?>
        </select>

        <label>Nueva Contraseña (Dejar vacío para no cambiar):</label>
        <input type="password" name="vchpassword" placeholder="Nueva contraseña opcional">

        <div class="botones">
            <button type="submit" class="guardar">Actualizar Usuario</button>
            <button type="button" class="cancelar" onclick="window.location.href='usuarios.php'">Cancelar</button>
        </div>
    </form>

</main>
</div>

<footer>
    <div class="linksFooter">
        <a>© 2026 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>