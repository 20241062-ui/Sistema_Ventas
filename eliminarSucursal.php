<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include("conexion.php");

if (!isset($_GET['id']) || empty($_GET['id'])) {
    die("ID de sucursal no especificado.");
}

$id = intval($_GET['id']);
$sql = "DELETE FROM tblsucursales WHERE intid = ?";

$stmt = $conn->prepare($sql);

if ($stmt === false) {
    echo "<script>alert('Error al preparar la consulta: " . htmlspecialchars($conn->error) . "');window.location.href = 'listaSucursales.php';</script>";
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) 
{
    if ($stmt->affected_rows > 0) {
        echo "<script>alert('La sucursal ha sido eliminada correctamente.');window.location.href = 'listaSucursales.php';</script>";
    } else {
        echo "<script>alert('Advertencia: La sucursal con ID $id no fue encontrada.');window.location.href = 'listaSucursales.php';</script>";
    }
    exit;
} 
else 
{
    echo "<script>alert('Ocurrió un error al eliminar la sucursal: " . htmlspecialchars($stmt->error) . "');window.location.href = 'listaSucursales.php';</script>";
    exit;
}

$stmt->close();
$conn->close();

?>
