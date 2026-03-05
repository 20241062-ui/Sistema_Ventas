<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if (
        empty($_POST['vchNo_Serie']) ||
        empty($_POST['vchNombre']) ||
        empty($_POST['floPrecioUnitario']) ||
        empty($_POST['floPrecioCompra'])
    ) {
        echo "<script>alert('Por favor completa los campos obligatorios.');</script>";
    } else {

        $nombreImagen = null;

        if (isset($_FILES['vchImagen']) && $_FILES['vchImagen']['error'] === UPLOAD_ERR_OK) 
        {
            //Validar tipo de imagen
            
            // Define los tipos MIME de imagen permitidos
            $tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            
            // Obtiene el tipo MIME real del archivo (requiere la extensión Fileinfo de PHP)
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $tipoMime = finfo_file($finfo, $_FILES['vchImagen']['tmp_name']);
            finfo_close($finfo);
            
            // VERIFICACIÓN: Comprueba si el tipo MIME real está en la lista de permitidos
            if (!in_array($tipoMime, $tiposPermitidos)) {
                echo "<script>alert('Error: El archivo debe ser una imagen (JPG, PNG, GIF o WEBP). Se detectó el tipo: " . $tipoMime . "');window.location.href = 'menuAdministrador.php';</script>";
                // Establece el error, o simplemente salta el resto del bloque de subida.
                // Usamos 'continue' o 'break' si estuviéramos en un bucle, pero aquí es mejor usar 'die' o un 'return' implícito.
                // Dado el flujo de tu script, simplemente salir del if actual y no definir $nombreImagen es suficiente para evitar el INSERT.
                exit();
                // Si necesitas detener la ejecución y no quieres que se procese el resto del código del formulario:
                // exit();
            }
            // Continúa con el resto del código de subida si la validación es exitosa...
            
            

            $directorio = realpath(__DIR__) . '/ComercializadoraLL/img/';

            if (!is_dir($directorio)) {
                mkdir($directorio, 0777, true);
            }

            $nombreOriginal = basename($_FILES['vchImagen']['name']);
            $rutaServidor = $directorio . $nombreOriginal;
            $nombreImagen = $nombreOriginal;

            if (!move_uploaded_file($_FILES['vchImagen']['tmp_name'], $rutaServidor)) {
                die("Error al subir la imagen. Por favor, verifica los permisos de la carpeta 'img'. Ruta intentada: " . $rutaServidor);
                $nombreImagen = null;
                exit();
            }
        }

        $sql = "INSERT INTO tblproductos 
        (vchNo_Serie, vchNombre, vchDescripcion, floPrecioUnitario, floPrecioCompra, 
        intStock, intid_Categoria, intid_Marca, vchImagen, Estado)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)";

        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssddiiis",
        
            $_POST['vchNo_Serie'],
            $_POST['vchNombre'],
            $_POST['vchDescripcion'],
            $_POST['floPrecioUnitario'],
            $_POST['floPrecioCompra'],
            $_POST['intStock'],
            $_POST['intid_Categoria'],
            $_POST['intid_Marca'],
            $nombreImagen
        );

        if ($stmt->execute()) 
        {
            echo "<script>alert('Producto agregado correctamente');window.location.href = 'menuAdministrador.php';</script>";
            exit;
        } 
        else 
        {
            echo "<script>alert('Error al agregar el producto');</script>";
        }
    }
}

$categorias = $conn->query("SELECT intid_Categoria, vchNombre FROM tblcategoria ORDER BY vchNombre ASC");
$marcas = $conn->query("SELECT intid_Marca, vchNombre FROM tblmarcas ORDER BY vchNombre ASC");
//$coberturas = $conn->query("SELECT intid_Cobertura, vchTipoCobertura FROM tblcobertura ORDER BY vchTipoCobertura ASC");

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nuevo Producto</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo">
        </a>

        <nav class="nav-admin">
            <a href="menuAdministrador.php">Productos</a>
            <a href="ventas.php">Ventas</a>
            <a href="compra.php">Compras</a>
            <a href="categorias.php" class="active">Categorías</a>
            <a href="marcas.php">Marcas</a>
            <a href="proveedores.php">Proveedores</a>
            <a href="listaSucursales.php">Sucursales</a>
            <a href="informacionEmpresa.php">Información</a>
            <a href="clientes.php">Clientes</a>
            <a href="preguntasFrecuentes.php">FAQ</a>
            <a href="contactoLista.php">Contacto</a>
            <a href="usuarios.php">Usuarios</a>
        </nav>

        <div class="user-menu">
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" alt="Perfil" class="profileicon">
            <div class="menu">
                <?php if(isset($_SESSION['usuario_id'])): ?>
                    <a href="perfilAdmin.php">Mi cuenta</a>
                    <a href="index.php">Inicio</a>
                    <a href="cerrar_sesion.php">Cerrar Sesión</a>
                <?php else: ?>
                    <a href="login.html">Iniciar sesión</a>
                    <a href="signup.html">Registrarse</a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</header>

<div class="container">
    <main class="main">

        <form class="panelP-formularioProductos" action="producto_nuevo.php" method="POST" enctype="multipart/form-data">
            <h2>Registrar nuevo producto</h2>

            <label for="vchNo_Serie">Número de serie:</label>
            <input type="text" id="vchNo_Serie" name="vchNo_Serie" pattern="[A-Za-z0-9\-]+" required>

            <label for="vchNombre">Nombre:</label>
            <input type="text" id="vchNombre" name="vchNombre" pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s0-9]+" required>

            <label for="vchDescripcion">Descripción:</label>
            <textarea id="vchDescripcion" name="vchDescripcion" rows="3"></textarea>

            <label for="floPrecioCompra">Precio de compra:</label>
            <input type="number" step="1" min="0" id="floPrecioCompra" name="floPrecioCompra" pattern="^[0-9]+$" required>

            <label for="floPrecioUnitario">Precio de venta:</label>
            <input type="number" step="1" min="0" id="floPrecioUnitario" name="floPrecioUnitario" pattern="^[0-9]+$" required>

            <label for="intStock">Stock inicial:</label>
            <input type="number"step="1" min="0" id="intStock" name="intStock" min="0" value="0" pattern="^[0-9]+$">

            <label for="intid_Categoria">Categoría:</label>
            <select id="intid_Categoria" name="intid_Categoria" required>
                <option value="">-- Selecciona --</option>
                <?php while($cat = $categorias->fetch_assoc()): ?>
                    <option value="<?= $cat['intid_Categoria'] ?>"><?= htmlspecialchars($cat['vchNombre']) ?></option>
                <?php endwhile; ?>
            </select>

            <label for="intid_Marca">Marca:</label>
            <select id="intid_Marca" name="intid_Marca" required>
                <option value="">-- Selecciona --</option>
                <?php while($mar = $marcas->fetch_assoc()): ?>
                    <option value="<?= $mar['intid_Marca'] ?>"><?= htmlspecialchars($mar['vchNombre']) ?></option>
                <?php endwhile; ?>
            </select>

            <label for="vchImagen">Imagen del producto:</label>
            <input type="file" id="vchImagen" name="vchImagen" accept="image/jpeg, image/png, image/gif, image/webp" required onchange="validarImagen(this);">

            <div class="botones">
                <button type="submit" class="guardar">Guardar</button>
                <button type="button" class="cancelar" onclick="window.location.href='menuAdministrador.php'">Cancelar</button>
            </div>
        </form>

    </main>
</div>

<footer>
    <div class="linksFooter">
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>
<script>
    function validarImagen(input) {
        const tiposPermitidos = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const archivo = input.files[0];
    
        if (archivo) {
            const nombreArchivo = archivo.name.toLowerCase();
            let esValido = false;
                
            
            for (let i = 0; i < tiposPermitidos.length; i++) {
                if (nombreArchivo.endsWith(tiposPermitidos[i])) {
                    esValido = true;
                    break;
                }
            }
                
            if (!esValido) 
            {
                alert('Error: Solo se permiten archivos de imagen con las extensiones JPG, PNG, GIF o WEBP.');
                input.value = ""; 
                return false;
            }
        }
        return true;
    }
        
</script>
</body>
</html>
