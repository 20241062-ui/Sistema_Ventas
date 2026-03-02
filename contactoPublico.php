<?php
include "conexion.php";
session_start();


// Consulta a la tabla (ajusta el nombre si es diferente)
$sql = "SELECT vchcampo, vchvalor FROM tblcontacto_info";
$result = $conn->query($sql);

$telefono = "";
$correo = "";
$facebook = "#";
$instagram = "#";
$x = "#";

while ($row = $result->fetch_assoc()) {
    switch (strtolower($row['vchcampo'])) {
        case "teléfono":
        case "telefono":
            $telefono = $row['vchvalor'];
            break;
        case "correo":
            $correo = $row['vchvalor'];
            break;
        case "facebook":
            $facebook = $row['vchvalor'];
            break;
        case "instagram":
            $instagram = $row['vchvalor'];
            break;
        case "x":
            $x = $row['vchvalor'];
            break;
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contacto - FlashCode</title>
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


<main class="acerca-container contacto">

    <h1 class="titulo-contacto">Contacto</h1>

    <p class="intro-text">
      Si tienes dudas, sugerencias o necesitas apoyo con tu compra, estamos aquí para ayudarte.
      Puedes comunicarte con nosotros mediante los siguientes medios.
    </p>


    <section class="contact-info card-contacto">
      <h2>Información de contacto</h2>

      <p><strong>📞 Teléfono:</strong> <?php echo $telefono; ?> </p>
      <p><strong>📧 Correo:</strong> <?php echo $correo; ?> </p>
      <p><strong>🕒 Horario de atención:</strong> Lunes a Viernes — 9:00 am a 6:00 pm</p>

      <h3>Síguenos</h3>
      <div class="social-icons">

        <a href="<?php echo $facebook; ?>" target="_blank" class="icon">
          <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/facebook1.png" alt="Facebook">
        </a>

        <a href="<?php echo $instagram; ?>" target="_blank" class="icon">
          <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/instagram1.png" alt="Instagram">
        </a>

        <a href="<?php echo $x; ?>" target="_blank" class="icon">
          <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/x.png" alt="X">
        </a>

      </div>
    </section>


    <section class="formulario-contacto card-contacto">
      <h2>Envíanos un mensaje</h2>

      <form action="enviarcorreo.php" method="POST" class="form-contact">
          <input type="text" name="nombre" placeholder="Tu nombre" required>
          <input type="email" name="correo" placeholder="Tu correo" required>
          <textarea name="mensaje" placeholder="Escribe tu mensaje..." rows="4" required></textarea>
          <button type="submit" class="btn-enviar">Enviar</button>
      </form>
    </section>

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
