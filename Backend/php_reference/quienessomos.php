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



  <main class="acerca-container">
    <h1>¿Quienes somos?</h1>
    <h2>Historia del Proyecto</h2>
    <p>
      Este proyecto comenzó como una simple tarea escolar. La idea inicial no era crear algo grande, solo cumplir con los requisitos que nos habían pedido. Hicimos una primera versión muy básica, solo lo mínimo indispensable para que funcionara y fuera presentada.

      Conforme avanzamos, nos dimos cuenta de que el proyecto tenía potencial. En lugar de dejarlo guardado después de la entrega final, decidimos retomarlo, corregirlo, arreglar detalles y mejorar muchas cosas. Poco a poco pasó de ser un trabajo más a convertirse en algo que realmente queríamos seguir desarrollando.
    </p>

    <h2>¿Por qué nació este proyecto?</h2>
    <p>
      Aunque inició por obligación académica, terminó convirtiéndose en una idea que nos motivó. Vimos que podíamos crear algo útil, funcional y con una experiencia mucho más completa. Empezó como una práctica, pero ahora buscamos que sea una plataforma real que pueda crecer y servir de verdad a los usuarios.
    </p>

    <h2>Cómo ha evolucionado</h2>
    <ul>
      <li>Reorganizamos la estructura</li>
      <li>Añadimos nuevas funciones</li>
      <li>Perfeccionamos el diseño</li>
      <li>Optimizamos cosas que al inicio ni sabíamos que eran importantes.</li>
    </ul>

    <h2>El equipo detrás del proyecto</h2>
    <p>
      Somos un equipo pequeño, alrededor de 4 integrantes. Cada uno aporta algo diferente: ideas, diseño, programación, pruebas o simplemente la motivación para que el proyecto siga creciendo. No somos una gran empresa ni un grupo con años de experiencia, pero sí tenemos algo que vale mucho: la disposición de seguir avanzando paso a paso.
      <br>
      Nos gusta trabajar de manera sencilla, comunicándonos entre nosotros, compartiendo ideas y buscando soluciones juntos. Cuando algo no sale bien, lo intentamos de nuevo; cuando algo funciona, lo mejoramos aún más. Así es como hemos llevado este proyecto desde una simple tarea hasta algo más completo y profesional.
      <br>
      Más que un equipo formal, somos un grupo de compañeros que disfruta construir cosas y ver cómo van tomando forma. Y aunque cada quien tiene su propio estilo, lo que nos une es que queremos ofrecer una plataforma que funcione bien, sea útil y siga creciendo con el tiempo.
    </p>
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
