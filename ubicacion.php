<?php
include("conexion.php");
session_start();

$sql = "SELECT * FROM tblsucursales";
$resultado = $conn->query($sql);


$sucursales = [];
while ($s = $resultado->fetch_assoc()) {
    $s['vchlink_mapa'] = str_replace("/viewer?", "/embed?", $s['vchlink_mapa']); 
    $sucursales[] = $s;
}


$primeraSucursal = $sucursales[0];
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Acerca de - FlashCode</title>
<link rel="stylesheet" href="home.css?=<?php echo time()?>">
<style>
.card-contacto { border: 1px solid #ccc; padding: 15px; border-radius: 8px; margin-top: 20px; }
iframe { width: 100%; height: 400px; border: 0; margin-top: 20px; }
</style>
</head>
<body>

<header>
<div class="contenedor-header">
    <a href="index.php"><img src="https://comercializadorall.grupoctic.com/ComercializadoraLL/img/whitelogo.png" alt="Logo" class="logo"></a>
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
<h1>Nuestras sucursales</h1>

<label for="sucursalSelect"><strong>Selecciona una sucursal:</strong></label>
<select id="sucursalSelect">
<?php foreach ($sucursales as $s) : ?>
    <option value="<?= htmlspecialchars($s['vchlink_mapa']) ?>" 
            data-direccion="<?= htmlspecialchars($s['vchdireccion']) ?>"
            data-ciudad="<?= htmlspecialchars($s['vchciudad']) ?>"
            data-telefono="<?= htmlspecialchars($s['vchtelefono']) ?>"
            data-horario="<?= htmlspecialchars($s['vchhorario']) ?>">
        <?= htmlspecialchars($s['vchnombre']) ?>
    </option>
<?php endforeach; ?>
</select>

<iframe id="mapaSucursal" src="<?= $primeraSucursal['vchlink_mapa'] ?>" allowfullscreen="" loading="lazy"></iframe>


<div class="card-contacto" id="cardSucursal">
    <h2><?= htmlspecialchars($primeraSucursal['vchnombre']) ?></h2>
    <p><strong>Dirección:</strong> <?= htmlspecialchars($primeraSucursal['vchdireccion']) ?></p>
    <p><strong>Ciudad:</strong> <?= htmlspecialchars($primeraSucursal['vchciudad']) ?></p>
    <p><strong>Teléfono:</strong> <?= htmlspecialchars($primeraSucursal['vchtelefono']) ?></p>
    <p><strong>Horario:</strong> <?= htmlspecialchars($primeraSucursal['vchhorario']) ?></p>
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

<script>
const select = document.getElementById('sucursalSelect');
const mapa = document.getElementById('mapaSucursal');
const card = document.getElementById('cardSucursal');

select.addEventListener('change', () => {
    const opcion = select.selectedOptions[0];

    
    mapa.src = opcion.value;

    
    card.innerHTML = `
        <h2>${opcion.textContent}</h2>
        <p><strong>Dirección:</strong> ${opcion.dataset.direccion}</p>
        <p><strong>Ciudad:</strong> ${opcion.dataset.ciudad}</p>
        <p><strong>Teléfono:</strong> ${opcion.dataset.telefono}</p>
        <p><strong>Horario:</strong> ${opcion.dataset.horario}</p>
    `;
});
</script>

</body>
</html>
