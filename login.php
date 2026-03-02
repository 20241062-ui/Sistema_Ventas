<?php
include "conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    $correo = trim($_POST['user']);
    $contrasena = trim($_POST['password']);

    if (empty($correo) || empty($contrasena)) {  
        echo "<script>
                alert('Por favor, complete todos los campos.');
                window.location.href='login.html'; 
              </script>";
        exit;
    }

    $stmt = $conn->prepare("SELECT id_usuario, vchNombre, vchpassword, vchRol FROM tblusuario WHERE vchcorreo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) 
    {
        $stmt->bind_result($id_usuario, $nombre, $hashed_password, $rol);
        $stmt->fetch();

        if (password_verify($contrasena, $hashed_password)) 
        {
            session_start();
            $_SESSION['usuario_id'] = $id_usuario;
            $_SESSION['usuario_nombre'] = $nombre; 
            $_SESSION['usuario_rol'] = $rol;

            if ($rol === 'Administrador') 
            {
                echo "<script>
                        window.location.href='menuAdministrador.php'; 
                </script>";
            } else {
                echo "<script>
                        window.location.href='index.php'; 
                </script>";
            }
            exit;

        } else {
            echo "<script>
                    alert('Contraseña Inválida.');
                    window.location.href='login.html';
                </script>";
            exit;
        }
    } else {
        echo "<script>
                alert('No se encontró ningún usuario con ese correo.');
                window.location.href='login.html';
        </script>";
        exit;
    }

    $stmt->close();
    $conn->close();

} else {
    echo "<script> alert('Método de solicitud no válido.'); </script>";
}
?>