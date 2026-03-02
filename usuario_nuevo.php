<?php
ini_set('session.cookie_lifetime', 0);
session_start();

// Verificamos sesión y rol de administrador
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

function getEnumValues($conn, $table, $field) {
    $result = $conn->query("SHOW COLUMNS FROM $table LIKE '$field'");
    $row = $result->fetch_assoc();
    preg_match("/^enum\((.*)\)$/", $row['Type'], $matches);
    $enum = explode(",", $matches[1]);
    return array_map(function($v) { return trim($v, "'"); }, $enum);
}

$rolesPermitidos = getEnumValues($conn, 'tblusuario', 'vchRol');

// PROCESAR EL REGISTRO
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nombre = trim($_POST['vchnombre']);
    $apellido = trim($_POST['vchapellido']);
    $correo = trim($_POST['vchcorreo']);
    $rol = $_POST['vchRol'];
    $contra = $_POST['vchpassword'];
    $estado = 1; // Por defecto activos al crearlos

    // Validar que la contraseña no esté vacía al ser un usuario nuevo
    if (empty($contra)) {
        echo "<script>alert('La contraseña es obligatoria para nuevos usuarios.'); window.history.back();</script>";
        exit;
    }

    // Encriptar la contraseña
    $passwordHash = password_hash($contra, PASSWORD_BCRYPT);

    try {
        // Insertar en tblusuario
        $sqlInsert = "INSERT INTO tblusuario (vchnombre, vchapellido, vchcorreo, vchRol, vchpassword, Estado) VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sqlInsert);
        $stmt->bind_param("sssssi", $nombre, $apellido, $correo, $rol, $passwordHash, $estado);
        
        if ($stmt->execute()) {
            echo "<script>alert('Nuevo usuario registrado con éxito'); window.location.href = 'usuarios.php';</script>";
            exit;
        }
    } catch (mysqli_sql_exception $e) {
        // Error común: Correo duplicado
        echo "<script>alert('Error: El correo electrónico ya está registrado en el sistema.'); window.history.back();</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Usuario - Admin</title>
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
        <h2>Registrar Nuevo Usuario</h2>
        <p style="margin-bottom: 20px; color: #666;">Complete los datos para dar acceso al sistema a un nuevo colaborador.</p>

        <label>Nombre(s):</label>
        <input type="text" name="vchnombre" placeholder="Ej. Juan Carlos" required>

        <label>Apellido(s):</label>
        <input type="text" name="vchapellido" placeholder="Ej. Pérez López" required>

        <label>Correo Electrónico (Será su usuario):</label>
        <input type="email" name="vchcorreo" placeholder="correo@empresa.com" required>

        <label>Rol / Puesto:</label>
        <select name="vchRol" required>
            <option value="" disabled selected>Seleccione un puesto...</option>
            <?php foreach($rolesPermitidos as $rol): ?>
                <option value="<?= $rol ?>"><?= $rol ?></option>
            <?php endforeach; ?>
        </select>

        <label>Contraseña Temporal:</label>
        <input type="password" name="vchpassword" placeholder="Mínimo 6 caracteres" required>

        <div class="botones">
            <button type="submit" class="guardar">Crear Usuario</button>
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