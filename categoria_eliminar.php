<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';

if (!isset($_GET['id'])) {
    header("Location: categorias.php");
    exit;
}

$id = $_GET['id'];
$sql = "DELETE FROM tblcategoria WHERE intid_Categoria = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();


if ($stmt->execute()) 
{
    echo "<script>alert('Categoria eliminada correctamente');window.location.href = 'categorias.php';</script>";
    exit;
} 
else 
{
    echo "<script>alert('Error al eliminar la categoria');</script>";
}

?>
