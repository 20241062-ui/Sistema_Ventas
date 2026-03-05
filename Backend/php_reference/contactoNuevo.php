<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php'; 


$mensaje = "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $campo = isset($_POST['campo']) ? trim($_POST['campo']) : "";
    $valor = isset($_POST['valor']) ? trim($_POST['valor']) : "";

    if ($campo == "" || $valor == "") {
        $mensaje = "Todos los campos son obligatorios.";
    } else {
        $sql = "INSERT INTO tblcontacto_info (vchcampo, vchvalor) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            die("Error en prepare: " . $conn->error);
        }

        $stmt->bind_param("ss", $campo, $valor);

       if ($stmt->execute()) 
        {
            echo "<script>alert('Contacto agregado correctamente');window.location.href = 'contactoLista.php';</script>";
            exit;
        } 
        else 
        {
            echo "<script>alert('Error al agregar el contacto');</script>";
        }
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Contacto</title>
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
    <h2>Registrar nuevo contacto</h2>

    <?php if ($mensaje != ""): ?>
      <p class="mensaje-error"><?= $mensaje ?></p>
    <?php endif; ?>

    <label for="campo">Campo:</label>
    <input type="text" id="campo" name="campo" required>

    <label for="valor">Valor:</label>
    <input type="text" id="valor" name="valor" required>

    <div class="botones">
      <button type="submit" class="guardar">Guardar</button>
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
