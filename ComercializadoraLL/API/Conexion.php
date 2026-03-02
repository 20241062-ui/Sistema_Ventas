<?php
// Conexion.php

$host = '127.0.0.1:3306';
$user = 'u138650717_ComerLL';
$pass = 'Ivanbm12345#'; 
$db   = 'u138650717_ComerLL';


error_reporting(0);
ini_set('display_errors', 0);


$conn = @new mysqli($host, $user, $pass, $db);


if ($conn->connect_error) {
    return; 
}

$conn->set_charset("utf8mb4");

