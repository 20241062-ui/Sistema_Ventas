<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';



if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    
    if (empty($_POST['vchtitulo']) || empty($_POST['vchcontenido'])) {
        echo "<script>alert('Por favor completa los campos obligatorios.');</script>";

    } else {
       
       
        $sql = "INSERT INTO tblinformacion 
        (vchtitulo, vchcontenido)
        VALUES (?, ?)";
        
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss",
            $_POST['vchtitulo'],
            $_POST['vchcontenido'],
   
        );
        
        if ($stmt->execute()) {
           echo "<script>alert('Información agregada correctamente'); window.location='informacionEmpresa.php';</script>";
            exit;
        } else {
            echo "<script>alert('Error al agregar la Información');</script>";
        }
        
        
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nueva Información</title>
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

  <form class="panelP-formularioProductos" action="informacionNueva.php" method="POST">
    <h2 >Registrar nueva informción</h2>

    <label for="vchtitulo">Titulo (Misión o Visión)</label>
    <input type="text" id="vchtitulo" name="vchtitulo" required>

    <label for="vchcontenido">Contenido:</label>
    <textarea id="vchcontenido" name="vchcontenido" rows="3"></textarea>


    <div class="botones">
      <button type="submit" class="guardar">Guardar</button>
      <button type="button" class="cancelar" onclick="window.location.href='informacionEmpresa.php'">Cancelar</button>
    </div>
  </form>

  <footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

</body>
</html>
