<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


// compraProducto.php
include('conexion.php');


// Nombre actual del script para redirecciones
$self = basename($_SERVER['PHP_SELF']);

// Mensajes flash simples
if (!isset($_SESSION['flash'])) $_SESSION['flash'] = null;
$flash = $_SESSION['flash'];
$_SESSION['flash'] = null;

// Verificar si existe una compra activa
if (!isset($_SESSION['id_compra'])) {
    header("Location: compra_nueva.php");
    exit;
}

// Inicializar el arreglo de detalle si no existe
if (!isset($_SESSION['detalle_compra']) || !is_array($_SESSION['detalle_compra'])) {
    $_SESSION['detalle_compra'] = [];
}

// Procesar agregado/actualización de producto
if (isset($_POST['agregar_producto'])) {
    $no_serie = isset($_POST['vchNo_Serie']) ? trim($_POST['vchNo_Serie']) : '';
    $cantidad = isset($_POST['cantidad']) ? (int)$_POST['cantidad'] : 0;

    // Validaciones básicas
    if ($no_serie === '') {
        $_SESSION['flash'] = ['type' => 'error', 'msg' => 'Selecciona un producto.'];
        header("Location: $self");
        exit;
    }
    if ($cantidad === 0) {
        $_SESSION['flash'] = ['type' => 'error', 'msg' => 'La cantidad no puede ser 0. Usa un número positivo para sumar o negativo para disminuir.'];
        header("Location: $self");
        exit;
    }

    // Obtener información del producto desde la BD
    $sql = "SELECT vchNombre, floPrecioCompra FROM tblproductos WHERE vchNo_Serie = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $_SESSION['flash'] = ['type' => 'error', 'msg' => 'Error en la consulta: ' . $conn->error];
        header("Location: $self");
        exit;
    }
    $stmt->bind_param("s", $no_serie);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $producto = $resultado->fetch_assoc();
    $stmt->close();

    if (!$producto) {
        $_SESSION['flash'] = ['type' => 'error', 'msg' => 'Producto no encontrado.'];
        header("Location: $self");
        exit;
    }

    // Buscar si ya está en el detalle
    $foundIndex = null;
    foreach ($_SESSION['detalle_compra'] as $index => $item) {
        if ($item['vchNo_Serie'] === $no_serie) {
            $foundIndex = $index;
            break;
        }
    }

    if ($foundIndex !== null) {
        // Actualizar cantidad
        $_SESSION['detalle_compra'][$foundIndex]['cantidad'] += $cantidad;
        $newQty = $_SESSION['detalle_compra'][$foundIndex]['cantidad'];

        if ($newQty <= 0) {
            unset($_SESSION['detalle_compra'][$foundIndex]);
            $_SESSION['detalle_compra'] = array_values($_SESSION['detalle_compra']);
            $_SESSION['flash'] = ['type' => 'info', 'msg' => 'Producto eliminado del detalle.'];
        } else {
            $precio = $_SESSION['detalle_compra'][$foundIndex]['precio_compra'];
            $_SESSION['detalle_compra'][$foundIndex]['subtotal'] = $precio * $newQty;
            $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Cantidad actualizada.'];
        }
    } else {
        if ($cantidad > 0) {
            $precio_compra = (float)$producto['floPrecioCompra'];
            $_SESSION['detalle_compra'][] = [
                'vchNo_Serie'   => $no_serie,
                'nombre'        => $producto['vchNombre'],
                'precio_compra' => $precio_compra,
                'cantidad'      => $cantidad,
                'subtotal'      => $precio_compra * $cantidad
            ];
            $_SESSION['flash'] = ['type' => 'success', 'msg' => 'Producto agregado.'];
        } else {
            $_SESSION['flash'] = ['type' => 'error', 'msg' => 'No puedes restar un producto que no está en el detalle.'];
        }
    }

    header("Location: $self");
    exit;
}

// Eliminar manualmente
if (isset($_GET['eliminar'])) {
    $index = (int)$_GET['eliminar'];
    if (isset($_SESSION['detalle_compra'][$index])) {
        unset($_SESSION['detalle_compra'][$index]);
        $_SESSION['detalle_compra'] = array_values($_SESSION['detalle_compra']);
        $_SESSION['flash'] = ['type' => 'info', 'msg' => 'Producto eliminado.'];
    }
    header("Location: $self");
    exit;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<title>Compra - Productos</title>
<link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>

<body class="Comprabody">

<div class="containerProducto">
    <h2 class="containerProducto-h2"> Compra - Agregar Productos</h2>

    <?php if ($flash): ?>
        <div class="flash <?= htmlspecialchars($flash['type']) ?>">
            <?= htmlspecialchars($flash['msg']) ?>
        </div>
    <?php endif; ?>

    <form method="POST" action="" class="formProduc">
        <label>Producto:
            <select name="vchNo_Serie" required>
                <option value="">-- Seleccione --</option>
                <?php
                $productos = $conn->query("SELECT vchNo_Serie, vchNombre FROM tblproductos WHERE Estado = 1 ORDER BY vchNombre");
                while ($p = $productos->fetch_assoc()):
                ?>
                    <option value="<?= htmlspecialchars($p['vchNo_Serie']) ?>">
                        <?= htmlspecialchars($p['vchNombre']) ?>
                    </option>
                <?php endwhile; ?>
            </select>
        </label>

        <label>Cantidad:
            <input type="number" name="cantidad" value="1" required>
        </label>

        <button type="submit" name="agregar_producto" class="small-btn info">Actualizar</button>
    </form>

    <table class="tabla-compra">
        <thead>
            <tr>
                <th>No. Serie</th>
                <th>Producto</th>
                <th>Precio Compra</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>
        <?php
        $total = 0;
        if (!empty($_SESSION['detalle_compra'])):
            foreach ($_SESSION['detalle_compra'] as $i => $it):
                $total += $it['subtotal'];
        ?>
            <tr>
                <td><?= htmlspecialchars($it['vchNo_Serie']) ?></td>
                <td><?= htmlspecialchars($it['nombre']) ?></td>
                <td>$<?= number_format($it['precio_compra'], 2) ?></td>
                <td><?= (int)$it['cantidad'] ?></td>
                <td>$<?= number_format($it['subtotal'], 2) ?></td>
                <td><a href="?eliminar=<?= $i ?>" class="small-btn">Eliminar</a></td>
            </tr>
        <?php endforeach; else: ?>
            <tr><td colspan="6">No hay productos agregados.</td></tr>
        <?php endif; ?>

            <tr>
                <th colspan="4" class="right">TOTAL</th>
                <th colspan="2">$<?= number_format($total, 2) ?></th>
            </tr>
        </tbody>
    </table>

    <div class="botones">
        <form method="POST" action="guardar_compra.php">
            <input type="hidden" name="total" value="<?= $total ?>">
            <button type="submit" name="guardar" class="small-btn info"> Guardar Compra</button>
        </form>

        <button onclick="window.location.href='compra_nueva.php'" class="small-btn">
            Cancelar compra
        </button>
    </div>

</div>

</body>
</html>
