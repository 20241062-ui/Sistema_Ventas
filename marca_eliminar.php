<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if (!isset($_GET['id'])) {
    header("Location: marcas.php");
    exit;
}

$id = $_GET['id'];

$sql = "DELETE FROM tblmarcas WHERE intid_Marca = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);

 if ($stmt->execute()) 
    {
        echo "<script>alert('Marca eliminada correctamente');window.location.href = 'marcas.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al eliminar la marca');</script>";
    }

?>
