<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html");
    exit();
}

include "conexion.php";
$id = $_SESSION['usuario_id'];

// 1. OBTENER DATOS ACTUALES
$stmt = $conn->prepare("SELECT vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, vchTelefono, vchPassword FROM tblcliente WHERE intid_Cliente = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($nombre, $apellidoP, $apellidoM, $correoUsuario, $telefono, $contrasenaHashActual);
$stmt->fetch();
$stmt->close();

// 2. PROCESAR EL FORMULARIO (POST)
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    
    $nuevoNombre    = trim($_POST['vchNombre']);
    $nuevoApellidoP = trim($_POST['vchApellido_Paterno']);
    $nuevoApellidoM = trim($_POST['vchApellido_Materno']);
    $nuevoTelefono  = trim($_POST['vchTelefono']);
    $nuevaContra    = $_POST['vchpassword']; 

    
    // Si el usuario escribió algo (no está vacío)
    if (!empty($nuevoTelefono)) {
        // Validamos que tenga exactamente 10 dígitos y sean solo números
        if (!preg_match('/^[0-9]{10}$/', $nuevoTelefono)) {
            echo "<script>alert('Error: Si ingresa un teléfono, debe tener exactamente 10 dígitos numéricos.'); window.history.back();</script>";
            exit;
        }
    } else {
        // Si está vacío, permitimos que se guarde como NULL o vacío
        $nuevoTelefono = null; 
    }

    // Lógica de contraseña
    if (empty($nuevaContra)) {
        $passwordParaGuardar = $contrasenaHashActual;
    } else {
        $passwordParaGuardar = password_hash($nuevaContra, PASSWORD_BCRYPT);
    }

    // UPDATE
    $stmtUpdate = $conn->prepare("UPDATE tblcliente SET vchNombre = ?, vchApellido_Paterno = ?, vchApellido_Materno = ?, vchTelefono = ?, vchPassword = ? WHERE intid_Cliente = ?");
    $stmtUpdate->bind_param("sssssi", $nuevoNombre, $nuevoApellidoP, $nuevoApellidoM, $nuevoTelefono, $passwordParaGuardar, $id);

    if ($stmtUpdate->execute()) {
        echo "<script>alert('Datos actualizados correctamente'); window.location='perfil.php';</script>";
        exit;
    } else {
        echo "<script>alert('Error al actualizar: " . $conn->error . "');</script>";
    }
    $stmtUpdate->close();
}
$conn->close();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Perfil - Doble L</title>
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
            color: white;
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
            color: #8737d1ff;
            font-size: 22px;
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: bold;
            margin-top: 15px;
            color: #333;
        }

        input {
            width: 100%;
            padding: 10px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
        }

        input[readonly] {
            background-color: #eee;
            cursor: not-allowed;
        }

        .botones {
            margin-top: 25px;
            display: flex;
            gap: 15px;
        }

        .btn-guardar {
            background-color: #8737d1ff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
        }

        .btn-guardar:hover {
            background-color: #7028b3;
        }

        .btn-cancelar {
            background-color: #333;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
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
                <p><?= htmlspecialchars($nombre . " " . $apellidoP) ?><br><?= htmlspecialchars($correoUsuario) ?></p>
                <a href="perfil.php">Mis datos</a>
                <a href="actualizarPerfil.php">Editar información</a>
                <a href="cerrar_sesion.php">Cerrar Sesión</a>
            </div>

            <div class="perfil-info">
                <h3>Editar información de cliente</h3>
                <form method="POST">
                    <label>Nombre(s):</label>
                    <input type="text" name="vchNombre" value="<?= htmlspecialchars($nombre) ?>" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" required>

                    <label>Apellido Paterno:</label>
                    <input type="text" name="vchApellido_Paterno" value="<?= htmlspecialchars($apellidoP) ?>" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" required>

                    <label>Apellido Materno:</label>
                    <input type="text" name="vchApellido_Materno" value="<?= htmlspecialchars($apellidoM) ?>" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" required>
                    <label>Teléfono de contacto:</label>
                    <input type="text" 
                           name="vchTelefono" 
                           id="vchTelefono"
                           value="<?= htmlspecialchars($telefono) ?>" 
                           placeholder="Ingresar si desea comprar"
                           maxlength="10"
                           onkeypress="return soloNumeros(event)">
                    <small id="telError" style="color: red; display: none;">Debe ingresar exactamente 10 números.</small>
                    
                    <label>Correo electrónico (No modificable):</label>
                    <input type="email" value="<?= htmlspecialchars($correoUsuario) ?>" readonly>

                    <label>Nueva Contraseña (dejar en blanco para no cambiar):</label>
                    <input type="password" name="vchpassword" placeholder="••••••••">

                    <div class="botones">
                        <button type="submit" class="btn-guardar">Guardar cambios</button>
                        <button type="button" class="btn-cancelar" onclick="window.location.href='perfil.php'">Cancelar</button>
                    </div>
                </form>
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