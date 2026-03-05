<?php
ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $sql = "INSERT INTO tblproveedor 
    (vchRFC, vchNombre, vchApellido_Paterno, vchApellido_Materno, vchColonia, intNo_ExteriorInterior, vchCodigo_Postal, vchCalle, vchTelefono, vchCorreo, vchRazon_Social)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssisssss",
        $_POST['vchRFC'], $_POST['vchNombre'], $_POST['vchApellido_Paterno'], $_POST['vchApellido_Materno'],
        $_POST['vchColonia'], $_POST['intNo_ExteriorInterior'], $_POST['vchCodigo_Postal'], $_POST['vchCalle'],
        $_POST['vchTelefono'], $_POST['vchCorreo'], $_POST['vchRazon_Social']
    );
    
    if ($stmt->execute()) 
    {
        echo "<script>alert('proveedor agregar correctamente');window.location.href = 'proveedores.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al agregar el Proveedor');</script>";
    }
    
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Nuevo Proveedor</title>
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

<form class="panelP-formularioProductos" action="proveedor_nuevo.php" method="POST">
    <h2>Registrar nuevo proveedor</h2>

    <label for="vchRFC">RFC:</label>
    <input type="text" id="vchRFC" name="vchRFC"
           pattern="[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}" 
           maxlength="13"
           placeholder="Ej: ABCD001122XX1"
           required>

    <label for="vchNombre">Nombre:</label>
    <input type="text" id="vchNombre" name="vchNombre"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
           required>

    <label for="vchApellido_Paterno">Apellido Paterno:</label>
    <input type="text" id="vchApellido_Paterno" name="vchApellido_Paterno"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+">

    <label for="vchApellido_Materno">Apellido Materno:</label>
    <input type="text" id="vchApellido_Materno" name="vchApellido_Materno"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+">

    <label for="vchColonia">Colonia:</label>
    <input type="text" id="vchColonia" name="vchColonia"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.-]+">

    <label for="intNo_ExteriorInterior">No. Exterior / Interior:</label>
    <input type="number" id="intNo_ExteriorInterior" name="intNo_ExteriorInterior"
           min="0">

    <label for="vchCodigo_Postal">Código Postal:</label>
    <input type="text" id="vchCodigo_Postal" name="vchCodigo_Postal"
           pattern="[0-9]{5}"
           maxlength="5">

    <label for="vchCalle">Calle:</label>
    <input type="text" id="vchCalle" name="vchCalle"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.-]+">

    <label for="vchTelefono">Teléfono:</label>
    <input type="text" id="vchTelefono" name="vchTelefono"
           pattern="[0-9]{10}"
           maxlength="10">

    <label for="vchCorreo">Correo:</label>
    <input type="email" id="vchCorreo" name="vchCorreo">

    <label for="vchRazon_Social">Razón Social:</label>
    <input type="text" id="vchRazon_Social" name="vchRazon_Social"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.&(),.-]+">

    <div class="botones">
      <button type="submit" class="guardar">Guardar</button>
      <button type="button" onclick="window.location.href='proveedores.php'" class="cancelar">Cancelar</button>
    </div>
</form>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>
</body>
</html>
