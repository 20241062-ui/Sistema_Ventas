<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if (isset($_GET['id'])) {
    $id = intval($_GET['id']);

    // Preparar la consulta de eliminación
    $sql = "DELETE FROM tblcontacto_info WHERE intid = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        die("Error en prepare: " . $conn->error);
    }

    $stmt->bind_param("i", $id);
    
    if ($stmt->execute()) 
    {
        echo "<script>alert('Contacto eliminado correctamente');window.location.href = 'contactoLista.php';</script>";
        exit;
    } 
    else 
    {
        echo "<script>alert('Error al eliminar el contacto');</script>";
    }

} else {
    
    echo "<script>alert('Error ID del contacto no especificado');window.location.href = 'contactoLista.php';</script>";
    exit();
}
?>
