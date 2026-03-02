<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';

if (!isset($_GET['id'])) {
    header("Location: preguntasFrecuentes.php");
    exit;
}

$id = intval($_GET['id']);

$sql = "SELECT * FROM tblpreguntasfrecuentes WHERE intid = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows == 0) {
    die("Pregunta no encontrada.");
}

$preg = $res->fetch_assoc();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pregunta = trim($_POST['pregunta']);
    $respuesta = trim($_POST['respuesta']);

    $sqlUp = "UPDATE tblpreguntasfrecuentes SET vchpregunta = ?, vchrespuesta = ?, fecha = NOW() WHERE intid = ?";
    $stmtUp = $conn->prepare($sqlUp);
    $stmtUp->bind_param("ssi", $pregunta, $respuesta, $id);

    if ($stmt->execute()) 
    {
        echo "<script>alert('Pregunta actualizada correctamente');window.location.href = 'preguntasFrecuentes.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al actualizar la pregunta');</script>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Actualizar Pregunta</title>
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

  <form class="panelP-formularioProductos" action="preguntaActualizar.php?id=<?= $id ?>" method="POST">
    <h2>Actualizar Pregunta Frecuente</h2>

    <?php if (!empty($error)): ?>
      <div class="alert error"><?= htmlspecialchars($error) ?></div>
    <?php endif; ?>

    <label>Pregunta:</label>
    <input type="text" name="pregunta" required value="<?= htmlspecialchars($preg['vchpregunta']) ?>">

    <label>Respuesta:</label>
    <textarea name="respuesta" rows="6" required><?= htmlspecialchars($preg['vchrespuesta']) ?></textarea>

    <div class="botones">
      <button type="submit" class="guardar">Actualizar</button>
      <button type="button" class="cancelar" onclick="window.location.href='preguntasFrecuentes.php'">Cancelar</button>
    </div>
  </form>


<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
