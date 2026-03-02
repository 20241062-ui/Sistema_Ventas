<?php

    include "conexion.php";


    if ($_SERVER["REQUEST_METHOD"] == "POST") 
    {
        $nombre = $_POST['nombre'];
        $apellidoP = $_POST['apellidoP'];
        $apellidoM = $_POST['apellidoM'];
        $correo = $_POST['email'];
        $contrasena = $_POST['password'];
       
        

       
        if (empty($nombre) || empty($apellidoP) ||  empty($apellidoM)  || empty($correo) || empty($contrasena)) {
            die("Por favor, complete todos los campos.");
        }
   
        $stmt = $conn->prepare("INSERT INTO tblcliente (vchNombre, vchApellido_Paterno, vchApellido_Materno, vchCorreo, vchPassword) VALUES (?, ?, ?, ?, ?)");

        $hash = password_hash($contrasena, PASSWORD_BCRYPT);
        $stmt->bind_param("sssss", $nombre, $apellidoP, $apellidoM, $correo, $hash);

        if ($stmt->execute()) 
        {
            $id_usuario_nuevo = $conn->insert_id;
            
            session_start();
            $_SESSION['usuario_id'] = $id_usuario_nuevo;
            $_SESSION['usuario_rol'] = 'Cliente';
            
            echo "<script>window.location.href='index.php'; </script>";

        } else {
            
            echo "Error en el registro: " . $stmt->error;
        }

        $stmt->close();
        $conn->close();

    } else 
    {
        echo "Método de solicitud no válido.";
    }
   
?>