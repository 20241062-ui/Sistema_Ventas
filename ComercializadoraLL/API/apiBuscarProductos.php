<?php

// 1. Configuración de Errores y Encabezados
error_reporting(0);
ini_set('display_errors', 0);
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

// 2. Inclusión de la Conexión a la Base de Datos
include_once __DIR__ . '/Conexion.php'; 

// Verificación de Conexión
if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error 500: Fallo en la conexión a la base de datos."]);
    exit();
}

// 3. Obtención y Validación del Parámetro de Búsqueda
$query = isset($_GET['q']) ? trim($_GET['q']) : ''; 

if (empty($query)) {
    // Si no hay búsqueda, devolvemos un array vacío (o podrías devolver todos los productos activos si es un filtro)
    http_response_code(200);
    echo json_encode([]);
    $conn->close();
    exit;
}

// Convertir la consulta a minúsculas
$queryLimpia = strtolower($query);

// Prepara el término para la cláusula LIKE: "%termino%"
$terminoBusqueda = "%" . $queryLimpia . "%"; 

// 4. Consulta SQL CORREGIDA Y SIMPLIFICADA: Solo por Nombre y Estado=1
$sql = "
    SELECT 
        P.vchNo_Serie, 
        P.vchNombre, P.vchDescripcion, P.Estado, 
        P.floPrecioUnitario, P.intStock, P.floPrecioCompra, P.vchImagen
        -- OMITIMOS los JOINs y los campos de Marca/Categoría/Cobertura por ahora
    FROM tblproductos P
    
    WHERE 
        LOWER(P.vchNombre) LIKE ? 
    
    AND P.Estado = 1;
";

// 5. Preparación y Ejecución de la Sentencia
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "Error 500: Fallo al preparar la consulta SQL.", "sql_error" => $conn->error]);
    $conn->close();
    exit();
}

// Vincula UN SOLO parámetro de tipo string ("s")
$stmt->bind_param("s", $terminoBusqueda);

$stmt->execute();
$resultado = $stmt->get_result();

// 6. Procesamiento y Respuesta JSON
$productos = [];
if ($resultado->num_rows > 0) {
    http_response_code(200);
    while($fila = $resultado->fetch_assoc()) {
        $productos[] = array(
            'vchNo_Serie' => $fila['vchNo_Serie'],
            // Nota: Marca/Categoría/Cobertura no están en el SELECT, pueden devolverse como null si tu clsProductos lo permite
            'vchNombre' => $fila['vchNombre'],
            'vchDescripcion' => $fila['vchDescripcion'],
            'Estado' => (int)$fila['Estado'], 
            'floPrecioUnitario' => (float)$fila['floPrecioUnitario'], 
            'intStock' => (int)$fila['intStock'], 
            'floPrecioCompra' => (float)$fila['floPrecioCompra'], 
            'vchImagen' => $fila['vchImagen']
        );
    }
    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
} else {
    http_response_code(200);
    echo json_encode([]); 
}

// 7. Cierre de Conexiones
$stmt->close();
$conn->close();