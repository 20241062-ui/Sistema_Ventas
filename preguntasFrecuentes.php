<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

$pagina = basename($_SERVER['PHP_SELF']); 

$busqueda = isset($_GET['buscar']) ? trim($_GET['buscar']) : "";

if ($busqueda != "") {
    $sql = "SELECT * FROM tblpreguntasfrecuentes
            WHERE intid LIKE ? OR vchpregunta LIKE ?
            ORDER BY intid ASC";
    $stmt = $conn->prepare($sql);
    if (!$stmt) { die("Error en prepare: " . $conn->error); }
    $param = "%$busqueda%";
    $stmt->bind_param("ss", $param, $param);
    $stmt->execute();
    $resultado = $stmt->get_result();
} else {
    $sql = "SELECT * FROM tblpreguntasfrecuentes ORDER BY intid ASC";
    $resultado = $conn->query($sql);
    if (!$resultado) { die("Error en query: " . $conn->error); }
}

// Opcional: Obtener estadísticas para las tarjetas (si aplica, se deja la estructura)
// $totalFAQ = $conn->query("SELECT COUNT(*) AS total FROM tblpreguntasfrecuentes")->fetch_assoc()['total'];
// $activosFAQ = $conn->query("SELECT COUNT(*) AS activos FROM tblpreguntasfrecuentes WHERE estado = 1")->fetch_assoc()['activos'];
// $inactivosFAQ = $conn->query("SELECT COUNT(*) AS inactivos FROM tblpreguntasfrecuentes WHERE estado = 0")->fetch_assoc()['inactivos'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>Preguntas Frecuentes - Panel Admin</title>
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
      <h2>Preguntas Frecuentes</h2>

            <div class="productos-superior">
        <button class="btn-superior" onclick="window.location.href='preguntaNueva.php'">Nueva pregunta</button>

        <form method="GET" action="preguntasFrecuentes.php" class="productos-buscar">
                    <input type="search" name="buscar" value="<?= htmlspecialchars($busqueda) ?>" placeholder="Buscar por ID o pregunta...">
          <button type="submit" class="btn-superior buscar">🔍 Buscar</button>
          <?php if ($busqueda != ""): ?>
            <button type="button" class="btn-superior limpiar" onclick="window.location.href='preguntasFrecuentes.php'">Limpiar</button>
          <?php endif; ?>
        </form>
      </div>

            <div class="panel table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Pregunta</th>
              <th>Respuesta</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <?php if ($resultado && $resultado->num_rows > 0): ?>
              <?php while ($fila = $resultado->fetch_assoc()): ?>
                <tr class="<?= $fila['estado'] == 0 ? 'inactivo' : '' ?>">
                  <td><?= htmlspecialchars($fila['intid']) ?></td>
                  <td><?= htmlspecialchars($fila['vchpregunta']) ?></td>
                  <td class="descripcion"><?= htmlspecialchars($fila['vchrespuesta']) ?></>
                  <td><?= $fila['estado'] == 1 ? 'Activo' : 'Inactivo' ?></td>
                  <td><?= htmlspecialchars($fila['fecha']) ?></td>
                  <td>
                      <button class="guardar" onclick="window.location.href='preguntaActualizar.php?id=<?= urlencode($fila['intid']) ?>'">Editar</button>
                    
                    <?php if ($fila['estado'] == 1): ?>
                      <button class="cancelar" onclick="if(confirm('¿Desactivar esta pregunta?')) window.location.href='preguntaBaja.php?id=<?= urlencode($fila['intid']) ?>&estado=0'">Baja</button>
                    <?php else: ?>
                      <button class="activar" onclick="if(confirm('¿Activar esta pregunta?')) window.location.href='preguntaBaja.php?id=<?= urlencode($fila['intid']) ?>&estado=1'">Activar</button>
                    <?php endif; ?>
                  </td>
                </tr>
              <?php endwhile; ?>
            <?php else: ?>
              <tr><td colspan="6">No se encontraron registros.</td></tr>
            <?php endif; ?>
          </tbody>
        </table>
      </div>

    </main>
  </div>

<footer>
    <div class="linksFooter">  
        <a>© 2025 FlashCode — Sistema de Ventas</a>
    </div>
</footer>
</body>
</html>
