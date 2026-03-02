<?php
// apiProductoPorCodigo.php

// 1. CONFIGURACIÓN INICIAL Y ENCABEZADOS
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 

// 2. Inclusión del archivo de conexión (AQUÍ SE CREA $conn)
include_once __DIR__ . '/Conexion.php';

// 3. Verificación de Conexión y Configuración de $conn
if (!isset($conn) || $conn->connect_error) { 
    http_response_code(500); 
    echo json_encode(["error" => "Error de conexión con la base de datos."]);
    exit();
}
// Configurar el set_charset
$conn->set_charset("utf8mb4"); 


// Obtener el código de producto (vchNo_Serie) y limpiar espacios
$codigo = isset($_GET['codigo']) ? trim($_GET['codigo']) : '';

// 4. VERIFICACIÓN DEL CÓDIGO
if (empty($codigo)) {
    http_response_code(400); 
    echo json_encode(["error" => "Parámetro 'codigo' no proporcionado."]);
    $conn->close();
    exit();
}

// 5. Preparación de la Consulta: UPPERCASE y Comodines
$codigoUpper = strtoupper($codigo);
// Crear el término de búsqueda con comodines para LIKE
$terminoBusquedaLike = "%" . $codigoUpper . "%"; 

// 6. CONSULTA SQL CON FILTRO DE ESTADO Y OPERADOR LIKE
$sql = "
    SELECT 
        p.vchNo_Serie, p.vchNombre, p.vchDescripcion, p.Estado, 
        p.floPrecioUnitario, p.intStock, p.floPrecioCompra, p.vchImagen,
        m.vchNombre AS vchMarca, 
        c.vchTipoCobertura AS vchCobertura,  
        cat.vchNombre AS vchCategoria 
    FROM 
        tblproductos p
    LEFT JOIN tblmarcas m ON p.intid_Marca = m.intid_Marca
    LEFT JOIN tblcobertura c ON p.intid_Cobertura = c.intid_Cobertura
    LEFT JOIN tblcategoria cat ON p.intid_Categoria = cat.intid_Categoria
    WHERE UPPER(TRIM(p.vchNo_Serie)) LIKE UPPER(?) 
    AND p.Estado = 1 
    LIMIT 1
";

// 7. Preparación y Ejecución de la Sentencia
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    http_response_code(500);
    echo json_encode(["error" => "Error al preparar la consulta: " . $conn->error]);
    $conn->close();
    exit();
}

// Vincula la variable con comodines ($terminoBusquedaLike)
$stmt->bind_param("s", $terminoBusquedaLike);
$stmt->execute();
$result = $stmt->get_result();

// 8. PROCESAMIENTO DE RESULTADOS
if ($result->num_rows === 1) {
    $producto = $result->fetch_assoc();
    
    // Conversión de tipos para JSON
    $producto['Estado'] = (int)$producto['Estado'];
    $producto['floPrecioUnitario'] = (float)$producto['floPrecioUnitario'];
    $producto['intStock'] = (int)$producto['intStock'];
    $producto['floPrecioCompra'] = (float)$producto['floPrecioCompra'];
    
    // Devolver éxito (código 200 OK)
    http_response_code(200);
    echo json_encode($producto, JSON_UNESCAPED_UNICODE);
} else {
    // Producto no encontrado (código 404 Not Found)
    http_response_code(404);
    echo json_encode(["error" => "Producto con código $codigo no encontrado o inactivo."]);
}

$stmt->close();
$conn->close();