<?php
session_start();
include("conexion.php");

$hero_serie = trim('VCH2007100');

$registrosPorPagina = 10;
$paginaActual = isset($_GET['p']) && is_numeric($_GET['p']) ? (int)$_GET['p'] : 1;
if ($paginaActual < 1) {
    $paginaActual = 1;
}

$sqlHero = "SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen
            FROM tblproductos
            WHERE vchNo_Serie = ? AND Estado = 1
            LIMIT 1";
$stmtHero = $conn->prepare($sqlHero);
$stmtHero->bind_param("s", $hero_serie);
$stmtHero->execute();
$hero = $stmtHero->get_result()->fetch_assoc();
$stmtHero->close();

$sqlTotal = "SELECT COUNT(*) AS total FROM tblproductos WHERE Estado = 1 AND vchNo_Serie <> ?";
$stmtTotal = $conn->prepare($sqlTotal);
$stmtTotal->bind_param("s", $hero_serie);
$stmtTotal->execute();
$totalFiltrados = $stmtTotal->get_result()->fetch_assoc()['total'];
$stmtTotal->close();

$totalPaginas = ceil($totalFiltrados / $registrosPorPagina);

if ($paginaActual > $totalPaginas && $totalPaginas > 0) {
    $paginaActual = $totalPaginas;
}
if ($totalPaginas == 0) {
    $paginaActual = 1;
}

$offset = ($paginaActual - 1) * $registrosPorPagina;

$sql = "SELECT vchNo_Serie, vchNombre, floPrecioUnitario, vchImagen
        FROM tblproductos
        WHERE Estado = 1 AND vchNo_Serie <> ?
        ORDER BY vchNo_Serie DESC
        LIMIT ? OFFSET ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sii", $hero_serie, $registrosPorPagina, $offset);
$stmt->execute();
$result = $stmt->get_result();
$stmt->close();

function construirUrlPaginacionPublica($pagina) {
    return "?p=" . $pagina;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Doble L</title>
    <link rel="stylesheet" href="home.css?=<?php echo time(); ?>">
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

<div class="hero-div">
    <div class="hero">
        <div class="textohero">
            <?php if ($hero): ?>
                <h1><?= htmlspecialchars($hero['vchNombre']); ?> por menos de $<?= number_format($hero['floPrecioUnitario'], 0); ?></h1>
            <?php else: ?>
                <h1>Producto destacado no disponible</h1>
            <?php endif; ?>
            <h3>Sólo en Comercializadora Doble L</h3>
        </div>

        <form action="productoDetalle.php" method="POST">
            <input type="hidden" name="producto_id" value="<?= htmlspecialchars($hero_serie); ?>">
            <button type="submit" class="comprar">Comprar</button>
        </form>
    </div>
</div>

<div>
    <h2 class="featured-text">Productos destacados</h2>
</div>

<div class="contenedor-productos">
    <div class="galeria-productos" style="flex-wrap: wrap;">

        <?php if ($result && $result->num_rows > 0): ?>
            <?php while($row = $result->fetch_assoc()): ?>
                <div class="producto">
                    <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/<?= $row['vchImagen'] != '' ? htmlspecialchars($row['vchImagen']) : 'sin-imagen.png'; ?>"
                    alt="producto" class="imagenproducto">

                    <div class="recuadro">
                        <div class="producto-detalle">
                            <div class="texto-producto">
                                <h2><?= htmlspecialchars($row['vchNombre']); ?></h2>
                                <h3>$<?= number_format($row['floPrecioUnitario'], 2); ?></h3>
                            </div>

                            <form action="productoDetalle.php" method="POST">
                                <input type="hidden" name="producto_id" value="<?= htmlspecialchars($row['vchNo_Serie']); ?>">
                                <button type="submit" class="comprarproducto">Comprar</button>
                            </form>
                        </div>
                    </div>
                </div>
            <?php endwhile; ?>
        <?php else: ?>
            <p style="text-align: center; width: 100%; margin: 20px;">No hay más productos destacados en esta página.</p>
        <?php endif; ?>
    </div>
</div>

<?php if ($totalPaginas > 1): ?>
    <div class="paginacion">
        
        <?php if ($paginaActual > 1): ?>
            <a href="<?= construirUrlPaginacionPublica($paginaActual - 1) ?>" class="pagina">&laquo; Anterior</a>
        <?php endif; ?>

        <?php for ($i = 1; $i <= $totalPaginas; $i++): ?>
            <a 
                class="pagina <?= $i == $paginaActual ? 'activa' : '' ?>" 
                href="<?= construirUrlPaginacionPublica($i) ?>">
                <?= $i ?>
            </a>
        <?php endfor; ?>

        <?php if ($paginaActual < $totalPaginas): ?>
            <a href="<?= construirUrlPaginacionPublica($paginaActual + 1) ?>" class="pagina">Siguiente &raquo;</a>
        <?php endif; ?>
        
    </div>
<?php endif; ?>

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
