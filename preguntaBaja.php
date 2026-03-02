<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

if (!isset($_GET['id']) || !isset($_GET['estado'])) {
    die("Datos incompletos.");
}

$id = intval($_GET['id']);
$estado = intval($_GET['estado']); 

$sql = "UPDATE tblpreguntasfrecuentes SET estado = ?, fecha = NOW() WHERE intid = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $estado, $id);

if ($stmt->execute()) {


    if ($estado == 0) {
        $msg = "Registro desactivado correctamente.";
    } else {
        $msg = "Registro activado correctamente.";
    }

    echo "<script>alert('$msg');window.location='preguntasFrecuentes.php';</script>";
    exit;

} else {

   
    $error_msg = "Error al actualizar el estado del registro.";
    echo "<script>alert('$error_msg');window.location='preguntasFrecuentes.php';</script>";
    exit;
}

?>
