<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html");
    exit();
}

include "conexion.php";

$id = $_SESSION['usuario_id'];

// Obtener datos actuales
$stmt = $conn->prepare("SELECT vchnombre, vchapellido, vchcorreo, vchpassword FROM tblusuario WHERE id_usuario = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$stmt->bind_result($nombre, $apellido, $correoUsuario, $contrasenaHashActual);
$stmt->fetch();
$stmt->close();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $nuevoNombre = trim($_POST['vchnombre']);
    $nuevoApellido = trim($_POST['vchapellido']);
    $nuevaContra = $_POST['vchpassword'];

    // Si no cambia contraseña, conservar la actual
    if (empty($nuevaContra)) {
        $passwordParaGuardar = $contrasenaHashActual;
    } else {
        $passwordParaGuardar = password_hash($nuevaContra, PASSWORD_DEFAULT);
    }

    // UPDATE SIN modificar el correo
    $stmtUpdate = $conn->prepare(
        "UPDATE tblusuario 
         SET vchnombre = ?, vchapellido = ?, vchpassword = ?
         WHERE id_usuario = ?"
    );
    $stmtUpdate->bind_param("sssi", $nuevoNombre, $nuevoApellido, $passwordParaGuardar, $id);

    if ($stmtUpdate->execute()) {
        $_SESSION['usuario_id'] = $id;

        echo "<script>alert('Datos actualizados correctamente'); 
        window.location='perfilAdmin.php';</script>";
        exit;
    } else {
        echo "<script>alert('Error al actualizar los datos');</script>";
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
            color: white;
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
            color: #8737d1ff;
            font-size: 22px;
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: bold;
            margin-top: 10px;
            color: #333;
        }

        input {
            width: 100%;
            padding: 8px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 6px;
        }

        .botones {
            margin-top: 25px;
            display: flex;
            gap: 15px;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-size: 15px;
            background-color: #8737d1ff;
        }

        .btn-cancelar {
            background-color: #333;
        }

        footer { 
            width: 100%; 
            background-color: #8A2BE2; 
            padding: 20px 0; 
        }

        .linksFooter { 
            display: flex; 
            justify-content: center; 
            color: white; 
            font-size: 18px; 
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
        
        <nav class="nav-admin">
            <a href="menuAdministrador.php" class="active">Productos</a>
            <a href="ventas.php">Ventas</a>
            <a href="compra.php">Compras</a>
            <a href="categorias.php">Categorías</a>
            <a href="marcas.php">Marcas</a>
            <a href="proveedores.php">Proveedores</a>
            <a href="listaSucursales.php">Sucursales</a>
            <a href="informacionEmpresa.php">Información</a>
            <a href="clientes.php">Clientes</a>
            <a href="preguntasFrecuentes.php">FAQ</a>
            <a href="contactoLista.php">Contacto</a>
            <a href="usuarios.php">Usuarios</a>
        </nav>
    </div>
</header>

<main>
    <div class="perfil-container">

        <div class="perfil-menu">
            <h2>Mi cuenta</h2>
            <p><?= htmlspecialchars($nombre) . " " . htmlspecialchars($apellido) ?><br><?= htmlspecialchars($correoUsuario) ?></p>
            <a href="perfilAdmin.php">Mis datos</a>
            <a href="actualizarPerfilA.php">Editar información</a>
            <a href="cerrar_sesion.php">Cerrar Sesión</a>
        </div>

        <div class="perfil-info">
            <h3>Editar información</h3>

            <form method="POST">

                <label>Nombre:</label>
                <input type="text" name="vchnombre" value="<?= htmlspecialchars($nombre) ?>" 
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" required>

                <label>Apellido:</label>
                <input type="text" name="vchapellido" value="<?= htmlspecialchars($apellido) ?>"
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$" required>

                <label>Correo (solo lectura):</label>
                <input type="email" value="<?= htmlspecialchars($correoUsuario) ?>" readonly>

                <label>Contraseña (dejar vacío si no la cambias):</label>
                <input type="password" name="vchpassword" placeholder="••••••••">

                <div class="botones">
                    <button type="submit" class="btn">Guardar cambios</button>
                    <button type="button" class="btn btn-cancelar" onclick="window.location.href='perfilAdmin.php'">Cancelar</button>
                </div>

            </form>

        </div>
    </div>
</main>

<footer>
    <div class="linksFooter">
        © 2025 FlashCode — Sistema de Ventas
    </div>
</footer>

</body>
</html>
