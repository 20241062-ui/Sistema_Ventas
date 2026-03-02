<?php

header('Content-Type: application/json');

include_once __DIR__ . '/Conexion.php';


$sqlMision = "SELECT intid, vchtitulo, vchcontenido, Estado
              FROM tblinformacion
              WHERE Estado = 1 AND vchtitulo = 'Misión'";

$resultMision = $conn->query($sqlMision);
$mision = [];


if ($resultMision->num_rows > 0) {
    while ($row = $resultMision->fetch_assoc()) {
        $mision[] = $row;
    }
}


$sqlVision = "SELECT intid, vchtitulo, vchcontenido, Estado
              FROM tblinformacion
              WHERE Estado = 1 AND vchtitulo = 'Visión'";

$resultVision = $conn->query($sqlVision);
$vision = [];


if ($resultVision->num_rows > 0) {
    while ($row = $resultVision->fetch_assoc()) {
        $vision[] = $row;
    }
}


$respuesta = [
    "mision" => $mision,
    "vision" => $vision
];

echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);


$conn->close();
?>
