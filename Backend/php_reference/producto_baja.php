<?php
ini_set('session.cookie_lifetime', 0);
session_start();

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'Administrador') {
    header("Location: login.html"); 
    exit();
}

include("conexion.php");

if (isset($_GET['id']) && isset($_GET['estado'])) 
{
    $id = $_GET['id']; 
    $estado = intval($_GET['estado']); 
    $id_producto = trim($id); 

    /*Trigger - Disparador*/
    $usuarioSistema = $_SESSION['usuario_nombre'];
    $rolUsuario = $_SESSION['usuario_rol'];

    $stmtVars = $conn->prepare("SET @usuario_sistema = ?, @rol_usuario = ?");
    $stmtVars->bind_param("ss", $usuarioSistema, $rolUsuario);
    $stmtVars->execute();
    $stmtVars->close();

    $sql = "UPDATE tblproductos SET Estado = ? WHERE vchNo_Serie = ?";
    $stmt = $conn->prepare($sql); 
    $stmt->bind_param("is", $estado, $id_producto);

    if ($stmt->execute()) {
        
        if ($estado == 0) {
            $msg = "Producto desactivado correctamente.";
        } else {
            $msg = "Producto activado correctamente.";
        }

        echo "<script>alert('$msg');window.location='menuAdministrador.php';</script>";
        exit;
        
    } else {
        
        $error_msg = "Error al actualizar el estado del producto.";
        echo "<script>alert('$error_msg');window.location='menuAdministrador.php';</script>";
        exit;
    }

    $stmt->close();
} 
else 
{
    header("Location: menuAdministrador.php");
    exit;
}
?>