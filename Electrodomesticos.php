<?php
include_once ('conexion.php');
session_start();

$hero_serie = trim('VCH2007102');

$sqlHero = "SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen 
            FROM tblproductos 
            WHERE vchNo_Serie = ?
            AND Estado = 1
            LIMIT 1";

$stmtHero = $conn->prepare($sqlHero);
$stmtHero->bind_param("s", $hero_serie);
$stmtHero->execute();
$hero_result = $stmtHero->get_result();
$hero = $hero_result->fetch_assoc();

$sql = "SELECT vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, vchImagen
        FROM tblproductos
        WHERE Estado = 1 AND intid_Categoria = 9
        AND vchNo_Serie <> ?
        ORDER BY vchNo_Serie DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $hero_serie);
$stmt->execute();
$productos = $stmt->get_result();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electrodomésticos - Doble L</title>
    <link rel="stylesheet" href="home.css?=<?php echo time()?>">
</head>
<body>

<header>
    <div class="contenedor-header">
        <a href="index.php">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
        </a>

        <nav>
            <a href="index.php" class="nav-link">Inicio</a>
            <a href="celulares.php" class="nav-link">Celulares</a>
            <a href="Accesorios.php" class="nav-link">Accesorios</a>
            <a href="Electrodomesticos.php" class="nav-link activo">Electrodomésticos</a>
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

<div class="hero-div-Electrodomesticos">
    <div class="hero">
        <div class="textohero">
            <?php if ($hero): ?>
                <h1><?php echo $hero['vchNombre']; ?> $<?php echo number_format($hero['floPrecioUnitario'], 2); ?></h1>
            <?php else: ?>
                <h1>Electrodoméstico no encontrado</h1>
            <?php endif; ?>
            <h3>Sólo en Comercializadora Doble L</h3>
        </div>

        <?php if ($hero): ?>
        <form action="productoDetalle.php" method="POST">
            <input type="hidden" name="producto_id" value="<?php echo $hero_serie; ?>">
            <button type="submit" class="comprar">Comprar</button>
        </form>
        <?php endif; ?>
    </div>
</div>

<h2 class="featured-text">Electrodomésticos</h2>

<div class="contenedor-productos">
    <div class="galeria-productos">

    <?php if ($productos->num_rows > 0): ?>
        <?php while ($row = $productos->fetch_assoc()): ?>
            <div class="producto">
                <img src="ComercializadoraLL/img/<?php echo trim($row['vchImagen']); ?>" class="imagenproducto">

                <div class="recuadro">
                    <div class="producto-detalle">
                        <div class="texto-producto">
                            <h2><?php echo trim($row['vchNombre']); ?></h2>
                            <h3>$<?php echo number_format($row['floPrecioUnitario'], 2); ?></h3>
                        </div>

                        <form action="productoDetalle.php" method="POST">
                            <input type="hidden" name="producto_id" value="<?php echo trim($row['vchNo_Serie']); ?>">
                            <button type="submit" class="comprarproducto">Comprar</button>
                        </form>
                    </div>
                </div>
            </div>
        <?php endwhile; ?>
    <?php else: ?>
        <p class="no-productos">No hay productos disponibles.</p>
    <?php endif; ?>

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
