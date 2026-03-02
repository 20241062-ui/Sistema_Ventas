<?php
    if($_POST){
        $nombre = $_POST['nombre'];
        $correo = $_POST['correo'];
        $mensaje = $_POST['mensaje'];

        $destino = "20241020@uthh.edu.mx"; 
        $asunto = "Nuevo mensaje desde el formulario";

        $contenido = "Nombre: $nombre\nCorreo: $correo\n\nMensaje:\n$mensaje";

        $headers = "From: $correo\r\n";

        mail($destino, $asunto, $contenido, $headers);

        echo "Mensaje enviado correctamente.";
    }
?>
