<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include("conexion.php");

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $sql = "INSERT INTO tblsucursales 
    (vchnombre, vchdireccion, vchciudad, vchtelefono, vchhorario, vchlink_mapa)
    VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssss",
        $_POST['nombre'], $_POST['direccion'], $_POST['ciudad'],
        $_POST['telefono'], $_POST['horario'], $_POST['linkmapa']
    );


    if ($stmt->execute()) 
    {
        echo "<script>alert('Ubicación agregada correctamente');window.location.href = 'listaSucursales.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al agregar Ubicación de la empresa');</script>";
    }
        
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Nueva Sucursal</title>
<link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>

<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
        </a>

        <nav class="nav-admin">
            <a href="menuAdministrador.php" class="active">Productos</a>
            <a href="ventas.php">Ventas</a>
            <a href="compra.php">Compras</a>
            <a href="categorias.php">Categorías</a>
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

<form class="panelP-formularioProductos" action="agregarSucursal.php" method="POST">

    <h2>Nueva Sucursal</h2>

    <label>Nombre de la sucursal:</label>
    <input type="text" name="nombre"
           pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
           maxlength="100" required>

    <label>Dirección:</label>
    <input type="text" name="direccion"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s#.-]+"
           maxlength="200" required>

    <label>Ciudad:</label>
    <input type="text" name="ciudad"
           pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$"
           maxlength="100" required>

    <label>Teléfono:</label>
    <input type="text" name="telefono"
           pattern="[0-9]{10}"
           maxlength="10"
           placeholder="10 dígitos">

    <label>Horario:</label>
    <input type="text" name="horario"
           pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s:-]+"
           maxlength="50"
           placeholder="9am - 6pm">

    <label>Link de Google Maps:</label>
    <input type="text" name="linkmapa"
           maxlength="300"
           placeholder="https://maps.google.com/...">

    <div class="botones">
      <button type="submit" class="guardar">Guardar</button>
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
