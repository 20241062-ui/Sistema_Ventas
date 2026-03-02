<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';

$nombre = $_POST['vchNombre'];

$sql = "INSERT INTO tblcategoria (vchNombre) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre);


if ($stmt->execute()) 
{
    echo "<script>alert('Categoria agregada correctamente');window.location.href = 'categorias.php';</script>";
    exit;
} 
else 
{
    echo "<script>alert('Error al agregar la categoria');</script>";
}


?>
