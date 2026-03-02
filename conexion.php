<?php
    $host = "127.0.0.1:3306";
    $user = "u138650717_ComerLL";
    $pass = "Ivanbm12345#";             
    $bd = "u138650717_ComerLL";


    $conn = new mysqli($host, $user, $pass, $bd);

    if ($conn->connect_error) {
        die("La conexión falló: " . $conn->connect_error);
        
    }
?>