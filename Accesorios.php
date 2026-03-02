<?php
include_once 'conexion.php';
session_start();

$hero_serie = 'VCH2007101';

$sqlHero = "SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen 
            FROM tblproductos 
            WHERE vchNo_Serie = ? AND Estado = 1
            LIMIT 1";

$stmtHero = $conn->prepare($sqlHero);
$stmtHero->bind_param("s", $hero_serie);
$stmtHero->execute();
$hero_result = $stmtHero->get_result();
$hero = $hero_result->fetch_assoc();

$sql = "SELECT vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, vchImagen
        FROM tblproductos
        WHERE Estado = 1 AND intid_Categoria = 8
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
    <title>Accesorios - Doble L</title>
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
                <a href="Accesorios.php" class="nav-link activo">Accesorios</a>
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

   <div class="hero-div-Accesorios">
        <div class="hero">
            <div class="textohero">
                <?php if ($hero): ?>
                    <h1><?php echo $hero['vchNombre']; ?> $<?php echo number_format($hero['floPrecioUnitario'], 2); ?></h1>
                <?php else: ?>
                    <h1>Accesorio Destacado No Encontrado</h1> 
                <?php endif; ?>
                <h3>Sólo en Comercializadora Doble L</h3>
            </div>
            
            <form action="productoDetalle.php" method="POST">
                <input type="hidden" name="producto_id" value="<?php echo $hero_serie; ?>">
                <button type="submit" class="comprar">Comprar</button>
            </form>
        </div>
    </div>
        
    <div>
        <h2 class="featured-text">Accesorios</h2>
    </div>

    <div class="contenedor-productos">
        <div class="galeria-productos">

        <?php while ($row = $productos->fetch_assoc()): ?>

            <div class="producto">
                <img src="ComercializadoraLL/img/<?php echo $row['vchImagen']; ?>" 
                     alt="producto" 
                     class="imagenproducto">

                <div class="recuadro">
                    <div class="producto-detalle">

                        <div class="texto-producto">
                            <h2><?php echo $row['vchNombre']; ?></h2>
                            <h3>$<?php echo number_format($row['floPrecioUnitario'], 2); ?></h3>
                        </div>

                        <form action="productoDetalle.php" method="POST">
                            <input type="hidden" name="producto_id" value="<?php echo $row['vchNo_Serie']; ?>">
                            <button type="submit" class="comprarproducto">Comprar</button>
                        </form>

                    </div>
                </div>
            </div>

        <?php endwhile; ?>

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
