<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if (!isset($_GET['id'])) {
    die("ID inválido");
}

$id = $_GET['id'];

$sql = "SELECT * FROM tblproductos WHERE vchNo_Serie = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id);
$stmt->execute();
$producto = $stmt->get_result()->fetch_assoc();

if (!$producto) {
    die("Producto no encontrado");
}

$marcas = $conn->query("SELECT * FROM tblmarcas ORDER BY vchNombre ASC");
$categorias = $conn->query("SELECT * FROM tblcategoria ORDER BY vchNombre ASC");

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $marca = $_POST['intid_Marca'];
    $categoria = $_POST['intid_Categoria'];
    $nombre = $_POST['vchNombre'];
    $descripcion = $_POST['vchDescripcion'];
    $precio = $_POST['floPrecioUnitario'];
    $stock = $_POST['intStock'];
    $precioCompra = $_POST['floPrecioCompra'];

    $nuevaImagen = $producto['vchImagen'];

    if (isset($_FILES['vchImagen']) && $_FILES['vchImagen']['error'] === UPLOAD_ERR_OK) 
    {
        //Validar imagen:
        
                // Define los tipos MIME de imagen permitidos
        $tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        // Obtiene el tipo MIME real del archivo (requiere la extensión Fileinfo de PHP)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $tipoMime = finfo_file($finfo, $_FILES['vchImagen']['tmp_name']);
        finfo_close($finfo);
        
        // VERIFICACIÓN: Comprueba si el tipo MIME real está en la lista de permitidos
        if (!in_array($tipoMime, $tiposPermitidos)) {
            echo "<script>alert('Error: El archivo debe ser una imagen (JPG, PNG, GIF o WEBP). Se detectó el tipo: " . $tipoMime . "');</script>";
            // Establece el error, o simplemente salta el resto del bloque de subida.
            // Usamos 'continue' o 'break' si estuviéramos en un bucle, pero aquí es mejor usar 'die' o un 'return' implícito.
            // Dado el flujo de tu script, simplemente salir del if actual y no definir $nombreImagen es suficiente para evitar el INSERT.
            exit();
            // Si necesitas detener la ejecución y no quieres que se procese el resto del código del formulario:
            // exit();
        }
        // Continúa con el resto del código de subida si la validación es exitosa...
        

        $nombreOriginal = $_FILES['vchImagen']['name'];
        $carpetaDestino = __DIR__ . '/ComercializadoraLL/img/';

        if (!is_dir($carpetaDestino)) {
            mkdir($carpetaDestino, 0777, true);
        }

        $rutaFinal = $carpetaDestino . $nombreOriginal;

        if (move_uploaded_file($_FILES['vchImagen']['tmp_name'], $rutaFinal)) {
            $nuevaImagen = $nombreOriginal;
        } else {
            die("Error al subir la imagen. Ruta intentada: " . $rutaFinal);
        }
    }

    try {

    // Actualizar datos generales (sin precio)
    $sqlUpdate = "UPDATE tblproductos 
                  SET intid_Marca = ?, 
                      intid_Categoria = ?, 
                      vchNombre = ?, 
                      vchDescripcion = ?, 
                      vchImagen = ?, 
                      intStock = ?, 
                      floPrecioCompra = ?
                  WHERE vchNo_Serie = ?";

        $stmtUpdate = $conn->prepare($sqlUpdate);
        $stmtUpdate->bind_param("iisssdss",
            $marca,
            $categoria,
            $nombre,
            $descripcion,
            $nuevaImagen,
            $stock,
            $precioCompra,
            $id
        );
    
        $stmtUpdate->execute();
    
        // Actualizar precio con procedimiento
        $sqlPrecio = "CALL sp_actualizar_precio(?, ?, ?,?)";
        $stmtPrecio = $conn->prepare($sqlPrecio);
        $stmtPrecio->bind_param("sdss", $id,$precio,$_SESSION['usuario_nombre'], $_SESSION['usuario_rol']);
        $stmtPrecio->execute();
        $stmtPrecio->close(); 
        while($conn->next_result()) { ; }
    
        echo "<script>alert('Producto actualizado correctamente');
              window.location.href = 'menuAdministrador.php';</script>";
        exit;
    
    } catch (mysqli_sql_exception $e) {
        echo "<script>alert('" . $e->getMessage() . "');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Editar Producto</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php"><img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" class="logo"></a>

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
            <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/profileicon.jpg" class="profileicon">
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

<form class="panelP-formularioProductos" method="POST" enctype="multipart/form-data">
    <h2>Editar producto</h2>

    <label>No. Serie:</label>
    <input type="text" value="<?= htmlspecialchars($producto['vchNo_Serie']) ?>" readonly>

    <label>Marca:</label>
    <select name="intid_Marca" required>
        <?php while($m = $marcas->fetch_assoc()): ?>
            <option value="<?= htmlspecialchars($m['intid_Marca']) ?>" <?= $m['intid_Marca'] == $producto['intid_Marca'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($m['vchNombre']) ?>
            </option>
        <?php endwhile; ?>
    </select>

    <label>Categoría:</label>
    <select name="intid_Categoria" required>
        <?php while($c = $categorias->fetch_assoc()): ?>
            <option value="<?= htmlspecialchars($c['intid_Categoria']) ?>" <?= $c['intid_Categoria'] == $producto['intid_Categoria'] ? 'selected' : '' ?>>
                <?= htmlspecialchars($c['vchNombre']) ?>
            </option>
        <?php endwhile; ?>
    </select>

    <label>Nombre:</label>
    <input type="text" name="vchNombre" value="<?= htmlspecialchars($producto['vchNombre']) ?>" required>

    <label>Descripción:</label>
    <textarea name="vchDescripcion" rows="3"><?= htmlspecialchars($producto['vchDescripcion']) ?></textarea>

    <label>Imagen actual:</label>
    <div class="preview">
        <img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/<?= htmlspecialchars($producto['vchImagen']) ?>" width="150">
    </div>

    <label>Nueva imagen (opcional):</label>
    <input type="file" id="vchImagen" name="vchImagen" accept="image/jpeg, image/png, image/gif, image/webp"  onchange="validarImagen(this);">

    <label>Precio Unitario:</label>
    <input type="number" step="1" min="0" name="floPrecioUnitario" value="<?= htmlspecialchars($producto['floPrecioUnitario']) ?>" required>

    <label>Stock:</label>
    <input type="number"  name="intStock" value="<?= htmlspecialchars($producto['intStock']) ?>" required>

    <label>Precio Compra:</label>
    <input type="number" step="1" min="0" name="floPrecioCompra" value="<?= htmlspecialchars($producto['floPrecioCompra']) ?>" required>

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
    
    const imagenOriginalSrc = document.getElementById('imagen-preview').src;

    function validarImagen(input) {
        const tiposPermitidos = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        const archivo = input.files[0];
        const imagenPreview = document.getElementById('imagen-preview'); 

        if (!archivo) {
            return true;
        }
        
        const nombreArchivo = archivo.name.toLowerCase();
        let esValido = false;

        
        for (let i = 0; i < tiposPermitidos.length; i++) {
            if (nombreArchivo.endsWith(tiposPermitidos[i])) {
                esValido = true;
                break;
            }
        }

        if (!esValido) {
          
            alert('Error: Solo se permiten archivos de imagen con las extensiones JPG, PNG, GIF o WEBP.');
            input.value = ""; // Limpia el campo
            
         
            imagenPreview.src = imagenOriginalSrc; 
            
            return false;
        }

       
        if (esValido) {
            const reader = new FileReader();

            reader.onload = function(e) {
                imagenPreview.src = e.target.result; 
            };

            reader.readAsDataURL(archivo);
        }

        return true;
    }
    document.querySelector('.panelP-formularioProductos').addEventListener('submit', function(e) {
        const inputImagen = document.getElementById('vchImagen');
       
        if (inputImagen.files.length > 0) {
            if (!validarImagen(inputImagen)) {
                e.preventDefault();
            }
        }
    });
</script>

</body>
</html>
