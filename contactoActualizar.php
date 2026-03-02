<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php'; 

$mensaje = "";

if (!isset($_GET['id'])) {
    header("Location: contactoLista.php");
    exit();
}

$id = intval($_GET['id']);


$sql = "SELECT * FROM tblcontacto_info WHERE intid = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows == 0) {
    header("Location: contactoLista.php");
    exit();
}

$contacto = $resultado->fetch_assoc();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $campo = isset($_POST['campo']) ? trim($_POST['campo']) : "";
    $valor = isset($_POST['valor']) ? trim($_POST['valor']) : "";

    if ($campo == "" || $valor == "") {
        $mensaje = "Todos los campos son obligatorios.";
    } else {
        $sql_update = "UPDATE tblcontacto_info SET vchcampo = ?, vchvalor = ? WHERE intid = ?";
        $stmt_update = $conn->prepare($sql_update);
        $stmt_update->bind_param("ssi", $campo, $valor, $id);

        if ($stmt->execute()) 
        {
            echo "<script>alert('Contacto actualizado correctamente');window.location.href = 'contactoLista.php';</script>";
            exit;
        } 
        else 
        {
            echo "<script>alert('Error al actualizar el contacto');</script>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Actualizar Contacto</title>
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

  <form class="panelP-formularioProductos" method="POST" action="">
    <h2>Actualizar contacto</h2>

    <?php if ($mensaje != ""): ?>
      <p class="mensaje-error"><?= $mensaje ?></p>
    <?php endif; ?>

    <label for="campo">Campo:</label>
    <input type="text" id="campo" name="campo" value="<?= htmlspecialchars($contacto['vchcampo']) ?>" required>

    <label for="valor">Valor:</label>
    <input type="text" id="valor" name="valor" value="<?= htmlspecialchars($contacto['vchvalor']) ?>" required>

    <div class="botones">
      <button type="submit" class="guardar">Actualizar</button>
      <button type="button" class="cancelar" onclick="window.location.href='contactoLista.php'">Cancelar</button>
    </div>
  </form>

  
<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
