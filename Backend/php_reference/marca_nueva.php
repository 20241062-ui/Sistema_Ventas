<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once('conexion.php');
  
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva Marca</title>
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
  

  <form class="panelP-formularioProductos" action="marca_guardar.php" method="POST">
          <h2>Registrar nueva marca</h2>

          <label for="vchNombre">Nombre de marca:</label>
          <input type="text" id="vchNombre" name="vchNombre"  pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" maxlength="40" required>

          <div class="botones">
              <button type="submit" class="guardar">Guardar</button>
              <button type="button" class="cancelar" onclick="window.location.href='marcas.php'">Cancelar</button>
          </div>
  </form>
 


<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
