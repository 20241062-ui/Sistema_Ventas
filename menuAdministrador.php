<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html");
    exit();
}

include_once 'conexion.php';

/* Paginacion*/

$busqueda = isset($_GET['buscar']) ? trim($_GET['buscar']) : "";
$registrosPorPagina = 10;
$paginaActual = isset($_GET['pagina']) ? intval($_GET['pagina']) : 1;
if ($paginaActual < 1) $paginaActual = 1;

$offset = ($paginaActual - 1) * $registrosPorPagina;

/* Contar Productos con Procedimiento */

$stmtTotal = $conn->prepare("CALL sp_contar_productos(?)");
$stmtTotal->bind_param("s", $busqueda);
$stmtTotal->execute();
$resultTotal = $stmtTotal->get_result();
$totalFiltrados = $resultTotal->fetch_assoc()['total'];
$stmtTotal->close();

$totalPaginas = ceil($totalFiltrados / $registrosPorPagina);

/*Obtener los productos con procedimiento */

$stmt = $conn->prepare("CALL sp_obtener_productos(?, ?, ?)");
$stmt->bind_param("sii", $busqueda, $offset, $registrosPorPagina);
$stmt->execute();
$resultado = $stmt->get_result();
$stmt->close();

/*Funcion para paginacion*/

function construirUrlPaginacion($pagina, $busqueda) {
    $url = "?pagina=" . $pagina;
    if (!empty($busqueda)) {
        $url .= "&buscar=" . urlencode($busqueda);
    }
    return $url;
}

/* Funcion de contar productos*/

$totalProductos = $conn->query("SELECT fn_contar_productos_por_estado(-1) AS total")->fetch_assoc()['total'];
$activos = $conn->query("SELECT fn_contar_productos_por_estado(1) AS activos")->fetch_assoc()['activos'];
$inactivos = $conn->query("SELECT fn_contar_productos_por_estado(0) AS inactivos")->fetch_assoc()['inactivos'];

?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Productos - Sistema de Ventas</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>
<body>

<header class="header-admin">
    <div class="contenedor-header">
        <a href="menuAdministrador.php">
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
        <h2>Productos registrados</h2>

        <div class="cards">
            <div class="card">
                <h3>Total productos</h3>
                <p class="big"><?= htmlspecialchars($totalProductos) ?></p>
            </div>
            <div class="card success">
                <h3>Activos</h3>
                <p class="big"><?= htmlspecialchars($activos) ?></p>
            </div>
            <div class="card warning">
                <h3>Inactivos</h3>
                <p class="big"><?= htmlspecialchars($inactivos) ?></p>
            </div>
        </div>

        <div class="productos-superior">
            <button class="btn-superior" onclick="window.location.href='producto_nuevo.php'">Nuevo producto</button>

            <form method="GET" action="menuAdministrador.php" class="productos-buscar">
                <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" 
                    placeholder="Buscar producto...">
                <?php if (empty($busqueda) && $paginaActual > 1): ?>
                    <input type="hidden" name="pagina" value="<?= $paginaActual ?>">
                <?php endif; ?>

                <button type="submit" class="btn-superior buscar">🔍 Buscar</button>

                <?php if ($busqueda != ""): ?>
                    <button type="button" class="btn-superior limpiar" onclick="window.location.href='menuAdministrador.php'">Limpiar</button>
                <?php endif; ?>
            </form>
        </div>

        <div class="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>N° Serie</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Precio Venta</th>
                        <th>Stock</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
                    <?php if ($resultado && $resultado->num_rows > 0): ?>
                        <?php while ($fila = $resultado->fetch_assoc()): ?>
                            <tr class="<?= $fila['Estado'] == 0 ? 'inactivo' : '' ?>">
                                <td><?= htmlspecialchars($fila['vchNo_Serie']) ?></td>
                                <td><?= htmlspecialchars($fila['vchNombre']) ?></td>
                                <td class="descripcion"><?= htmlspecialchars($fila['vchDescripcion']) ?></td>
                                <td>$<?= number_format($fila['floPrecioUnitario'], 2) ?></td>
                                <td><?= htmlspecialchars($fila['intStock']) ?></td>
                                <td><?= $fila['Estado'] == 1 ? 'Activo' : 'Inactivo' ?></td>

                                <td class="acciones">
                                    <button class="guardar" onclick="window.location.href='producto_actualizar.php?id=<?= urlencode($fila['vchNo_Serie']) ?>'">Editar</button>

                                    <?php if ($fila['Estado'] == 1): ?>
                                        <button class="cancelar" onclick="if(confirm('¿Dar de baja este producto?')) window.location.href='producto_baja.php?id=<?= urlencode($fila['vchNo_Serie']) ?>&estado=0'">Baja</button>
                                    <?php else: ?>
                                        <button class="activar" onclick="if(confirm('¿Activar este producto?')) window.location.href='producto_baja.php?id=<?= urlencode($fila['vchNo_Serie']) ?>&estado=1'">Activar</button>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endwhile; ?>
                    <?php else: ?>
                        <tr><td colspan="7">No se encontraron productos.</td></tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>

        <?php if ($totalPaginas > 1): ?>
        <div class="paginacion">
            <?php if ($paginaActual > 1): ?>
                <a class="pagina" href="<?= construirUrlPaginacion($paginaActual - 1, $busqueda) ?>">&laquo; Anterior</a>
            <?php endif; ?>

            <?php for ($i = 1; $i <= $totalPaginas; $i++): ?>
                <a 
                    class="pagina <?= $i == $paginaActual ? 'activa' : '' ?>" 
                    href="<?= construirUrlPaginacion($i, $busqueda) ?>">
                    <?= $i ?>
                </a>
            <?php endfor; ?>

            <?php if ($paginaActual < $totalPaginas): ?>
                <a class="pagina" href="<?= construirUrlPaginacion($paginaActual + 1, $busqueda) ?>">Siguiente &raquo;</a>
            <?php endif; ?>
        </div>
        <?php endif; ?>

    </main>
</div>

<div class="accesibilidad">
    <button class="btn-accesibilidad" onclick="toggleAccesibilidad()">
        <img src="https://comercializadorall.grupoctic.com/img/Acceso.png" alt="Accesibilidad" class="icono-accesibilidad">
    </button>

    <div class="panel-accesibilidad" id="panelAccesibilidad">
        <button onclick="cambiarTexto(1)">Aumentar Texto</button>
        <button onclick="cambiarTexto(-1)">Disminuir Texto</button>
        <button onclick="restaurarTexto()">Restaurar</button>
        <button onclick="toggleLectura()">Modo Lectura</button>
        <button onclick="leerPaginaCompleta()">Leer Página</button>
        <button onclick="detenerVoz()">Detener Voz</button>
    </div>
</div>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>

<script>
function toggleAccesibilidad() {
    const panel = document.getElementById("panelAccesibilidad");
    panel.style.display = (panel.style.display === "flex") ? "none" : "flex";
}

let tamañoActual = 100;

function cambiarTexto(cambio) {
    tamañoActual += cambio * 10;
    if (tamañoActual < 50) tamañoActual = 50;
    if (tamañoActual > 200) tamañoActual = 200;
    document.body.style.fontSize = tamañoActual + "%";
}

function restaurarTexto() {
    tamañoActual = 100;
    document.body.style.fontSize = "100%";
}

let lecturaActiva = false;

function toggleLectura() {
    lecturaActiva = !lecturaActiva;
    alert(lecturaActiva 
        ? "Modo lectura activado. Selecciona texto para escucharlo." 
        : "Modo lectura desactivado.");
}

document.addEventListener("mouseup", () => {
    if (!lecturaActiva) return;
    let texto = window.getSelection().toString().trim();
    if (texto.length > 0) leerTexto(texto);
});

function leerTexto(texto) {
    detenerVoz();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = "es-MX";
    speechSynthesis.speak(mensaje);
}

function leerPaginaCompleta() {
    leerTexto(document.body.innerText);
}

function detenerVoz() {
    if (speechSynthesis.speaking) speechSynthesis.cancel();
}
</script>

</body>
</html>
