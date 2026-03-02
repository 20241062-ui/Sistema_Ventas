<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';



if (!isset($_GET['id'])) {
    die("Error: No se recibió el ID.");
}

$id = intval($_GET['id']);


$sql = "SELECT id_usuario, vchnombre, vchapellido, vchcorreo, Estado
        FROM tblusuario 
        WHERE id_usuario = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows == 0) {
    die("Error: Cliente no encontrado.");
}

$cliente = $resultado->fetch_assoc();


if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $idUser = $_POST['id_usuario'];
    $nombre = trim($_POST['nombre']);
    $apellido = trim($_POST['apellido']);
    $correo = trim($_POST['correo']);
    $estado = intval($_POST['estado']);

    $sqlUpdate = "UPDATE tblusuario
                  SET vchnombre = ?, vchapellido = ?, vchcorreo = ?, Estado = ?
                  WHERE id_usuario = ?";

    $stmtUp = $conn->prepare($sqlUpdate);
    $stmtUp->bind_param("sssii", $nombre, $apellido, $correo, $estado, $idUser);


    if ($stmt->execute()) 
    {
        echo "<script>alert('Cliete actualizado correctamente');window.location.href = 'clientes.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al actualizar el Cliente');</script>";
    }

}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Actualizar Cliente</title>
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

<form class="panelP-formularioProductos" method="POST">

    <h2>Actualizar Cliente</h2>

    <input type="hidden" name="id_usuario" value="<?= $cliente['id_usuario'] ?>">

    <label>Nombre:</label>
    <input type="text" name="nombre" required value="<?= htmlspecialchars($cliente['vchnombre']) ?>" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$">

    <label>Apellido:</label>
    <input type="text" name="apellido" required value="<?= htmlspecialchars($cliente['vchapellido']) ?>" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$">

    <label>Correo electrónico:</label>
    <input type="email" name="correo" required value="<?= htmlspecialchars($cliente['vchcorreo']) ?>" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$">

    <label>Estado:</label>
    <select name="estado">
        <option value="1" <?= $cliente['Estado'] == 1 ? 'selected' : '' ?>>Activo</option>
        <option value="0" <?= $cliente['Estado'] == 0 ? 'selected' : '' ?>>Inactivo</option>
    </select>

    <div class="botones">
        <button type="submit" class="guardar">Actualizar</button>
        <button type="button" class="cancelar" onclick="window.location.href='clientes.php'">Cancelar</button>
    </div>

</form>


<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>


</body>
</html>
