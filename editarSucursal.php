<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include("conexion.php");

if (!isset($_GET['id'])) {
    die("ID no especificado");
}

$id = intval($_GET['id']);

$sql = "SELECT * FROM tblsucursales WHERE intid = $id";
$result = $conn->query($sql);

if ($result->num_rows == 0) {
    die("Sucursal no encontrada");
}

$sucursal = $result->fetch_assoc();

$errores = [];

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $nombre = trim($_POST['nombre']);
    $direccion = trim($_POST['direccion']);
    $ciudad = trim($_POST['ciudad']);
    $telefono = trim($_POST['telefono']);
    $horario = trim($_POST['horario']);
    $linkmapa = trim($_POST['linkmapa']);

    // Validaciones
    if ($nombre == "") $errores[] = "El nombre es obligatorio.";
    if ($direccion == "") $errores[] = "La dirección es obligatoria.";
    if ($ciudad == "") $errores[] = "La ciudad es obligatoria.";

    if ($telefono != "" && !preg_match('/^[0-9\s\-\+\(\)]{7,20}$/', $telefono)) {
        $errores[] = "El teléfono no es válido.";
    }

    if ($linkmapa != "" && !filter_var($linkmapa, FILTER_VALIDATE_URL)) {
        $errores[] = "El link de Google Maps no es válido.";
    }

    // Si NO hay errores → actualizar
    if (empty($errores)) {

        $update = "UPDATE tblsucursales SET 
                    vchnombre=?, 
                    vchdireccion=?, 
                    vchciudad=?, 
                    vchtelefono=?, 
                    vchhorario=?, 
                    vchlink_mapa=? 
                   WHERE intid=?";

        $stmt = $conn->prepare($update);

        $stmt->bind_param(
            "ssssssi",
            $nombre,
            $direccion,
            $ciudad,
            $telefono,
            $horario,
            $linkmapa,
            $id
        );

        if ($stmt->execute()) {
            echo "<script>alert('Ubicación actualizada correctamente');window.location.href = 'listaSucursales.php';</script>";
            exit;
        } else {
            echo "<script>alert('Error al actualizar la Información de la Ubicación');</script>";
        }

    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Sucursal</title>
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

<form class="panelP-formularioProductos" action="" method="POST">

    <h2>Editar Sucursal</h2>

    <?php if (!empty($errores)): ?>
        <div class="error-box">
            <?php foreach ($errores as $e): ?>
                <p><?= $e ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <label>Nombre:</label>
    <input type="text" name="nombre" 
           value="<?= $sucursal['vchnombre'] ?>" 
           pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
           maxlength="60"
           required>

    <label>Dirección:</label>
    <input type="text" name="direccion" 
           value="<?= $sucursal['vchdireccion'] ?>" 
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.,-]{1,80}"
           maxlength="80"
           required>

    <label>Ciudad:</label>
    <input type="text" name="ciudad" 
           value="<?= $sucursal['vchciudad'] ?>" 
           pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
           maxlength="40"
           required>

    <label>Teléfono:</label>
    <input type="text" name="telefono" 
           value="<?= $sucursal['vchtelefono'] ?>" 
           pattern="[0-9]{10}"
           maxlength="10"
           placeholder="10 dígitos">

    <label>Horario:</label>
    <input type="text" name="horario" 
           value="<?= $sucursal['vchhorario'] ?>" 
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s:.-]{1,40}"
           maxlength="40"
           placeholder="Ejemplo: Lun-Sab 8:00-18:00">

    <label>Link de Google Maps:</label>
    <input type="url" name="linkmapa" 
           value="<?= $sucursal['vchlink_mapa'] ?>"
           maxlength="250"
           placeholder="URL válida">

    <div class="botones">
        <button type="submit" class="guardar">Guardar cambios</button>
        <button type="button" class="cancelar" onclick="window.location.href='listaSucursales.php'">
            Cancelar
        </button>
    </div>

</form>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
