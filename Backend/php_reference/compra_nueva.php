<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include('conexion.php');

if (isset($_POST['crear'])) {
    $rfc = $_POST['vchRFC'];
    $fecha = date('Y-m-d');

    // Insertar nueva compra
    $sql = "INSERT INTO tblcompra (RFC, Fecha, TotalCompra) VALUES (?, ?, 0)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $rfc, $fecha);

    if ($stmt->execute()) {
        $id_compra = $stmt->insert_id;
        $_SESSION['id_compra'] = $id_compra;
        $_SESSION['detalle_compra'] = array();

        header("Location: compraProducto.php");
        exit;
    } else {
        echo "<script>alert('❌Error al crear la compra.');</script>";
    }
}
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Nueva Compra</title>
    <link rel="stylesheet" href="estiloAdmin.css?=<?php echo time()?>">
</head>

<body class="sucursalesBody">

    <form method="POST" action="" class="formulario-sucursal">
        <h2>🛒 Nueva Compra</h2>

        <label for="vchRFC">Proveedor:</label>
        <select name="vchRFC" id="vchRFC" class="select-proveedor" required>
            <option value="">Seleccione un proveedor</option>

            <?php
            $query = "SELECT vchRFC, vchNombre, vchApellido_Paterno, 
                             vchApellido_Materno, vchRazon_Social 
                      FROM tblproveedor 
                      ORDER BY vchNombre ASC";

            $resultado = $conn->query($query);

            if (!$resultado) {
                echo "<option disabled>⚠️ Error al cargar proveedores</option>";
            } elseif ($resultado->num_rows == 0) {
                echo "<option disabled>⚠️ No hay proveedores registrados</option>";
            } else 
            {
                while ($fila = $resultado->fetch_assoc()) 
                {
                    $nombre = trim($fila['vchNombre'] . " " . $fila['vchApellido_Paterno'] . " " . $fila['vchApellido_Materno']);

                    $razon = $fila['vchRazon_Social'] ? " ({$fila['vchRazon_Social']})" : "";

                    echo "<option value='{$fila['vchRFC']}'>" . htmlspecialchars($nombre . $razon) . "</option>";
                }
            }
            ?>
        </select>

        <div class="botones">
            <button type="submit" name="crear" class="guardar">Crear Compra</button>
            <button type="button" class="cancelar" onclick="window.location.href='compra.php'">Cancelar</button>
        </div>
    </form>

</body>
</html>
