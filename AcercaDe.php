<?php  
  include('conexion.php');
 session_start();
 
  $sqlMision = "SELECT vchtitulo,vchcontenido FROM tblinformacion  WHERE vchtitulo = 'Visión' AND estado = 1 LIMIT 1";

  $mision = $conn->query($sqlMision)->fetch_assoc();

  
  $sqlVision = "SELECT vchtitulo,vchcontenido  FROM tblinformacion  WHERE vchtitulo = 'Misión' AND estado = 1 LIMIT 1";
  $vision = $conn->query($sqlVision)->fetch_assoc();

?>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Acerca de - FlashCode</title>
  <link rel="stylesheet" href="home.css?=<?php echo time()?>">

</head>
<body>

   <header>
        <div class="contenedor-header">
            <a href="index.php">
			    <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
			    <h1 class="nombre-pagina">
			    </h1>
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
    <h1>Acerca de FlashCode</h1>
    <h2><?= $mision['vchtitulo'] ?></h2>
    <p><?=  $mision['vchcontenido'] ?></p>

    <h2><?= $vision['vchtitulo'] ?></h2>
    <p><?=  $vision['vchcontenido'] ?></p>

    <h2>Valores</h2>
    <ul>
      <li><strong>Innovación:</strong> Buscamos constantemente mejorar y adaptar nuestras soluciones a las necesidades reales de los usuarios.</li>
      <li><strong>Compromiso:</strong> Trabajamos con responsabilidad y dedicación para garantizar un servicio confiable.</li>
      <li><strong>Transparencia:</strong> Fomentamos la confianza a través de la claridad y honestidad en nuestros procesos.</li>
      <li><strong>Colaboración:</strong> Promovemos el trabajo en equipo y la comunicación efectiva entre usuarios y desarrolladores.</li>
      <li><strong>Excelencia:</strong> Nos esforzamos por ofrecer siempre un producto funcional, estable y de alta calidad.</li>
    </ul>
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
