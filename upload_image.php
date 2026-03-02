<?php
// Directorio donde se guardarán las imágenes
// **VERIFICA Y AJUSTA ESTA RUTA EN TU SERVIDOR**
$uploadDir = 'ComercializadoraLL/img/'; 

// 1. Asegúrate de que el directorio de subida exista
if (!is_dir($uploadDir)) {
    // Si no existe, intenta crearlo con permisos de escritura (0777)
    mkdir($uploadDir, 0777, true); 
}

// 2. Verifica si se envió un archivo con el nombre de campo 'image'
if (isset($_FILES['image'])) {
    $file = $_FILES['image'];

    // Obtener el nombre original del archivo
    $fileName = basename($file['name']);
    $targetFilePath = $uploadDir . $fileName;
    $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));

    // 3. Permitir ciertos formatos de archivo para seguridad
    $allowTypes = array('jpg', 'png', 'jpeg', 'gif');
    if (in_array($fileType, $allowTypes)) {
        // 4. Mover el archivo temporal al directorio de destino
        if (move_uploaded_file($file['tmp_name'], $targetFilePath)) {
            // Éxito: Envía una respuesta JSON
            echo json_encode(['success' => true, 'message' => 'La imagen se ha subido correctamente.', 'filename' => $fileName]);
        } else {
            // Error al mover/guardar el archivo (generalmente problemas de permisos)
            http_response_code(500); 
            echo json_encode(['success' => false, 'message' => 'Error al subir la imagen al servidor. Verifique los permisos de la carpeta ' . $uploadDir]);
        }
    } else {
        // Tipo de archivo no permitido
        http_response_code(400); 
        echo json_encode(['success' => false, 'message' => 'Tipo de archivo no permitido. Solo JPG, JPEG, PNG, GIF.']);
    }
} else {
    // No se recibió el campo 'image'
    http_response_code(400); 
    echo json_encode(['success' => false, 'message' => 'No se ha enviado ningún archivo de imagen.']);
}
?>