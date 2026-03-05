<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include_once 'conexion.php';

$id = $_POST['intid_Marca'];
$nombre = $_POST['vchNombre'];

$sql = "UPDATE tblmarcas SET vchNombre=? WHERE intid_Marca=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("si", $nombre, $id);

 if ($stmt->execute()) 
    {
        echo "<script>alert('Marca actualizada correctamente');window.location.href = 'marcas.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al actualizar la marca');</script>";
    }
?>
