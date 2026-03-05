<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include('conexion.php');

if (!isset($_SESSION['id_compra']) || empty($_SESSION['detalle_compra'])) {
    header("Location: compraProducto.php");
    exit;
}

$id_compra = $_SESSION['id_compra'];
$total = isset($_POST['total']) ? $_POST['total'] : 0;


foreach ($_SESSION['detalle_compra'] as $item) 
{
    $no_serie = $item['vchNo_Serie'];
    $cantidad = (int)$item['cantidad'];
    $precio_compra = (float)$item['precio_compra'];

   
    $precio_venta = $precio_compra * 1.05;

   
    $fecha_garantia = date('Y-m-d', strtotime('+6 months'));

    $sql = "INSERT INTO tbldetallecompra (id_Compra, No_Serie, Cantidad, PrecioCompra, PrecioVenta, FechaGarantia)
            VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("isidds", $id_compra, $no_serie, $cantidad, $precio_compra, $precio_venta, $fecha_garantia);
        $stmt->execute();
    } else {
        die(" Error al preparar la inserción de detalle: " . $conn->error);
    }

  
    $sql_update = "UPDATE tblproductos 
                   SET intStock = intStock + ? 
                   WHERE vchNo_Serie = ?";
    $stmt2 = $conn->prepare($sql_update);
    if ($stmt2) {
        $stmt2->bind_param("is", $cantidad, $no_serie);
        $stmt2->execute();
    } else {
        die(" Error al preparar la actualización de stock: " . $conn->error);
    }
}


$sql_total = "UPDATE tblcompra SET TotalCompra = ? WHERE id_Compra = ?";
$stmt_total = $conn->prepare($sql_total);
if ($stmt_total) {
    $stmt_total->bind_param("di", $total, $id_compra);
    $stmt_total->execute();
} else {
    die(" Error al actualizar total de compra: " . $conn->error);
}


unset($_SESSION['detalle_compra']);
unset($_SESSION['id_compra']);


echo "<script>
    alert(' Compra registrada correctamente');
    window.location='compra.php';
</script>";
?>
