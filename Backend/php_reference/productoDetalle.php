<?php

include("conexion.php");
session_start();

// validar que venga el id
if (!isset($_POST['producto_id'])) {
    header("Location: home.php");
    exit();
}

$id = $_POST['producto_id'];

$sql = "SELECT 
            p.vchNo_Serie,
            p.vchNombre,
            p.vchDescripcion,
            p.floPrecioUnitario,
            p.vchImagen,
           m.vchNombre AS Marca
        FROM tblproductos p
        INNER JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca
        WHERE p.vchNo_Serie = ? AND p.Estado = 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {

    echo "<script>alert('Producto no encontrado.');</script>";
    exit();
}

$producto = $result->fetch_assoc();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $producto['vchNombre'] ?> - Doble L</title>
    <link rel="stylesheet" href="home.css?=<?php echo time()?>"> 
</head>

<body>

<header>
    <div class="contenedor-header">
        <a href="index.php">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
            <h1 class="nombre-pagina"></h1>
        </a>

        <nav>
                <a href="index.php" class="nav-link">Inicio</a>
                <a href="celulares.php" class="nav-link activo">Celulares</a>
                <a href="Accesorios.php" class="nav-link">Accesorios</a>
                <a href="Electrodomesticos.php" class="nav-link">Electrodomésticos</a>
        </nav>

        <div class="user-menu">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" alt="Logo" class="profileicon">
            <div class="menu">
                <?php if(isset($_SESSION['usuario_id'])): ?>
                    <a href="perfil.php">Mi cuenta</a>
                
                    <?php if(isset($_SESSION['usuario_rol']) && $_SESSION['usuario_rol'] === 'Administrador'): ?>
                        <a href="menuAdministrador.php">Panel de Administración</a>
                    <?php endif; ?>
                
                    <a href="cerrar_sesion.php">Cerrar Sesión</a>
                <?php else: ?>
                    <a href="login.html">Iniciar sesión</a>
                    <a href="signup.html">Registrarse</a>
                <?php endif; ?>    
            </div>
        </div>
    </div>
</header>


<div class="producto-detalle-contenedor">

    <div class="producto-detalle-imagen">
        <img src="/ComercializadoraLL/img/<?= $producto['vchImagen'] ?>" alt="<?= $producto['vchNombre'] ?>">
    </div>

    <div class="producto-detalle-info">

        <h4 class="marca-texto"><?= $producto['Marca'] ?></h4> 
        <h1><?= $producto['vchNombre'] ?></h1>

        <h2 class="precio-detalle">
            $<?= number_format($producto['floPrecioUnitario'], 2) ?>
        </h2>

        <p class="descripcion-detalle">
            <?= nl2br($producto['vchDescripcion']) ?>
        </p>

        
        <div class="colores">
            <span class="color pastelpink"></span>
            <span class="color nude"></span>
            <span class="color blue"></span>
            <span class="color black"></span>
        </div>

        <form action="#" method="POST">
            <input type="hidden" name="producto_id" value="<?= $producto['vchNo_Serie'] ?>">
            <button type="submit" class="comprarproducto">
                Comprar
            </button>
        </form>
    </div>

</div>


<footer>
    <div class="linksFooter">
        <a href="AcercaDe.php"><h3>Acerca de</h3></a>
        <a href="quienessomos.php"><h3>¿Quiénes somos?</h3></a>
        <a href="contactoPublico.php"><h3>Contacto</h3></a>
        <a href="ubicacion.php"><h3>Ubicación</h3></a>
        <a href="politicaCompra.php"><h3>Políticas</h3></a>
        <a href="preguntasFrecuentesPublic.php"><h3>Preguntas Frecuentes</h3></a>
    </div>
</footer>

</body>
</html>
