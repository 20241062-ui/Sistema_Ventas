<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}


include("conexion.php");

if (isset($_GET['id']) && isset($_GET['Estado'])) 
{
    $id = $_GET['id'];
    $estado = $_GET['Estado'];

   
    $sql = "UPDATE tblinformacion SET Estado = ? WHERE intid = ?";
    $stmt = $conn->prepare($sql);  
    $stmt->bind_param("ii", $estado, $id);

    /*if ($stmt->execute()) {
        //header("Location: informacionEmpresa.php");
        //exit;
    } */
    
    if ($stmt->execute()) 
    {
        echo "<script>alert('La información ha sido dada de baja correctamente.');window.location.href = 'informacionEmpresa.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Ocurrió un error al dar de baja la información.');</script>";
    }
} 
?>
