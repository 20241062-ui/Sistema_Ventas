<?php  
include('conexion.php');
session_start();

// Obtener todas las preguntas activas
$sqlPreguntas = "SELECT vchpregunta, vchrespuesta 
                 FROM tblpreguntasfrecuentes 
                 WHERE estado = 1
                 ORDER BY intid ASC";

$preguntas = $conn->query($sqlPreguntas);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preguntas Frecuentes - FlashCode</title>
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
                <a href="celulares.php" class="nav-link activo">Celulares</a>
                <a href="Accesorios.php" class="nav-link">Accesorios</a>
                <a href="Electrodomesticos.php" class="nav-link">Electrodomésticos</a>
        </nav>

        <div class="user-menu">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" alt="Perfil" class="profileicon">

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


<main class="acerca-container">
    <h1>Preguntas Frecuentes</h1>

    <?php while($row = $preguntas->fetch_assoc()): ?>
        <h2><?= $row['vchpregunta'] ?></h2>
        <p><?= $row['vchrespuesta'] ?></p>
    <?php endwhile; ?>

</main>

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
