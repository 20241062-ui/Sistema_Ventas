<?php

ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include_once 'conexion.php';

// Validar que venga ID y estado
if (!isset($_GET['id']) || !isset($_GET['estado'])) {
    die("Error: Datos incompletos.");
}

$id = intval($_GET['id']);
$estado = intval($_GET['estado']); 

$sql = "UPDATE tblusuario SET Estado = ? WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $estado, $id);

if ($stmt->execute()) {

    if ($estado == 0) {
        $msg = "Cliente desactivado correctamente.";
    } else {
        $msg = "Cliente activado correctamente.";
    }

    echo "<script>alert('$msg');window.location='clientes.php'; </script>";
} else {
    echo "<script> alert('Error al actualizar el estado del cliente.'); window.location='clientes.php'; </script>";
}
?>
