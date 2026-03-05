<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';
if (!isset($_GET['id'])) {
    header("Location: proveedores.php");
    exit;
}
$id = $_GET['id'];
$sql = "DELETE FROM tblproveedor WHERE vchRFC = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id);


if ($stmt->execute()) 
{
    if ($stmt->affected_rows > 0) {
        echo "<script>alert('El proveedor ha sido eliminado correctamente.');window.location.href = 'proveedores.php';</script>";
    } else {
        echo "<script>alert('Advertencia: El proveedor con ID $id no fue encontrado.');window.location.href = 'proveedores.php';</script>";
    }
    exit;
} 
else 
{
    echo "<script>alert('Ocurrió un error al eliminar el proveedor: " . htmlspecialchars($stmt->error) . "');window.location.href = 'proveedores.php';</script>";
    exit;
}


?>
