<?php
    session_start();

   if (isset($_SESSION['usuario_id'])) 
    {
        header("Location: index.php");
        
    } else {
    
        header("Location: login.html");
        exit();
    }

?>