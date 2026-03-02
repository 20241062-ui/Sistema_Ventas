<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['intid_Categoria'];
    $nombre = $_POST['vchNombre'];

    $sql = "UPDATE tblcategoria SET vchNombre = ? WHERE intid_Categoria = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $nombre, $id);

    if ($stmt->execute()) 
    {
        echo "<script>alert('Categoria actualizada correctamente');window.location.href = 'categorias.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al actualizar la categoria');</script>";
    }
}

if (!isset($_GET['id'])) {
    header("Location: categorias.php");
    exit;
}

$id = $_GET['id'];

$sql = "SELECT * FROM tblcategoria WHERE intid_Categoria = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$categoria = $result->fetch_assoc();

if (!$categoria) {
    echo "Categoría no encontrada.";
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Actualizar Categoría</title>
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


<form class="panelP-formularioProductos" action="categoria_actualizar.php" method="POST">
    <h2>Actualizar Categoría</h2>

    <input type="hidden" name="intid_Categoria" value="<?php echo htmlspecialchars($categoria['intid_Categoria']); ?>">

    <label for="vchNombre">Nombre de categoría:</label>
    <input type="text" id="vchNombre" name="vchNombre"
           value="<?php echo htmlspecialchars($categoria['vchNombre']); ?>"
           pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
           maxlength="40"
           required>

    <div class="botones">
        <button type="submit" class="guardar">Actualizar</button>
        <button type="button" onclick="window.location.href='categorias.php'" class="cancelar">Cancelar</button>
    </div>
</form>



<footer>
    <div class="linksFooter">
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
