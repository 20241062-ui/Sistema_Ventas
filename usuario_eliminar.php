<?php
session_start();
include_once 'conexion.php';

// Seguridad: Solo admin puede borrar
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    exit("Acceso denegado");
}

if (isset($_GET['id'])) {
    $id = $_GET['id'];

    // Evitar eliminarse a sí mismo
    if ($id == $_SESSION['usuario_id']) {
        echo "<script>alert('No puedes eliminar tu propia cuenta mientras estás en sesión.'); window.location='usuarios.php';</script>";
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM tblusuario WHERE id_usuario = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo "<script>alert('Usuario eliminado permanentemente'); window.location='usuarios.php';</script>";
    } else {
        echo "<script>alert('Error al eliminar: El usuario podría tener registros vinculados.'); window.location='usuarios.php';</script>";
    }
    $stmt->close();
}
$conn->close();
?>