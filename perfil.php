<?php
session_start();
include "conexion.php";

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.php");
    exit();
}

$id = $_SESSION['usuario_id'];

$stmt = $conn->prepare("SELECT vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo FROM tblcliente WHERE intid_Cliente = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$stmt->bind_result($nombre, $apellidoP, $apellidoM, $correoUsuario);
$stmt->fetch();

$apellidoCompleto = $apellidoP . " " . $apellidoM;

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Perfil - Doble L</title>
    <link rel="stylesheet" href="home.css?=<?php echo time()?>">
    <style>
        main {
            display: flex;
            width: 100%;
            justify-content: center;
            align-items: center;
            padding: 80px 20px;
            background-color: #f5f5f5;
            min-height: 80vh;
        }

        .perfil-container {
            display: flex;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            width: 80%;
            max-width: 1000px;
            overflow: hidden;
            flex-wrap: wrap;
        }

        .perfil-menu {
            width: 100%;
            background-color: #8737d1ff;
            color: white;
            padding: 30px 20px;
        }

        .perfil-menu h2 {
            font-size: 22px;
            margin-bottom: 15px;
            text-align: center;
        }

        .perfil-menu p {
            font-size: 15px;
            text-align: center;
            margin-bottom: 25px;
            opacity: 0.9;
        }

        .perfil-menu a {
            display: block;
            color: white;
            text-decoration: none;
            background-color: rgba(255,255,255,0.15);
            margin: 8px 0;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
        }

        .perfil-menu a:hover {
            background-color: rgba(255,255,255,0.25);
        }

        .perfil-info {
            width: 100%;
            padding: 40px;
        }

        h3 {
            color: #8A2BE2;
            font-size: 22px;
            margin-bottom: 20px;
        }

        p {
            font-size: 16px;
            margin-bottom: 10px;
        }

        .btn-editar {
            margin-top: 25px;
            padding: 10px 20px;
            background-color: #8A2BE2;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        }

        .btn-editar:hover {
            background-color: #530853ff;
        }

       
        footer {
            width: 100%;
            height: fit-content;
            background-color: #8A2BE2;
            padding-top: 20px;
            padding-bottom: 20px;
        }

        .linksFooter {
            display: flex;
            flex-wrap: wrap;
            row-gap: 20px;
            column-gap: 20px;
            align-items: center;
            justify-content: center;
        }

        .linksFooter a 
        {
            text-decoration: none;
            color: #ffffff;
            font-size: 18px; 
            font-weight: 600;
        }

        .linksFooter a h3 
        {
            color: #ffffff;
            margin: 0;
            font-size: 18px; 
            font-family: SF; 
            font-weight: 600;
        }
    </style>
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
                <a href="Electrodomesticos.php" class="nav-link">Electrodomésticos</a>
            </nav>
        </div>
    </header>

    <main>
        <div class="perfil-container">
            <div class="perfil-menu">
                <h2>Mi cuenta</h2>
                <p><?= htmlspecialchars($nombre) . " " . htmlspecialchars($apellidoCompleto) ?><br><?= htmlspecialchars($correoUsuario) ?></p>
                <a href="perfil.php">Mis datos</a>
                <a href="actualizarPerfil.php">Editar información</a>
                <a href="cerrar_sesion.php">Cerrar sesión</a>
            </div>

            <div class="perfil-info">
                <h3>Información del perfil</h3>
                <p><strong>Nombre:</strong> <?= htmlspecialchars($nombre) ?></p>
                <p><strong>Apellidos :</strong> <?= htmlspecialchars($apellidoCompleto) ?></p>
                <p><strong>Correo:</strong> <?= htmlspecialchars($correoUsuario) ?></p>

                <button class="btn-editar" onclick="window.location.href='actualizarPerfil.php'">Editar perfil</button>
            </div>
        </div>
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
