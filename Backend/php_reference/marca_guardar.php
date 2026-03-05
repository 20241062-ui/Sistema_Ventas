<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

$nombre = $_POST['vchNombre'];

$sql = "INSERT INTO tblmarcas (vchNombre) VALUES (?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre);

    if ($stmt->execute()) 
    {
        echo "<script>alert('Marca agregada correctamente');window.location.href = 'marcas.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al agregar una nueva marca');</script>";
    }

?>
