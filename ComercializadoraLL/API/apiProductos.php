<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

error_reporting(0);
ini_set('display_errors', 0);

// Establece el encabezado para indicar que la respuesta es JSON
header('Content-Type: application/json');

// Incluye el archivo de conexión
include_once __DIR__ . '/Conexion.php';

// VERIFICACIÓN CRÍTICA DE LA CONEXIÓN 
if ($conn->connect_error) {
    echo json_encode([]);
    $conn->close();
    exit();
}


$sql = "
    SELECT 
        -- Campos de tblproductos
        p.vchNo_Serie, 
        p.vchNombre, 
        p.vchDescripcion, 
        p.Estado, 
        p.floPrecioUnitario, 
        p.intStock, 
        p.floPrecioCompra, 
        p.vchImagen,
        
        p.intid_Marca, 
        p.intid_Cobertura,
        p.intid_Categoria,


        m.vchNombre AS vchMarca,      
        
        c.vchTipoCobertura AS vchCobertura,
        c.intMeses_Cobertura,
        
        cat.vchNombre AS vchCategoria 
        
    FROM 
        tblproductos p
    
    -- 1. JOIN MARCA: p.intid_Marca = m.intid_Marca 
    LEFT JOIN 
        tblmarcas m ON p.intid_Marca = m.intid_Marca
        
    -- 2. JOIN COBERTURA: p.intid_Cobertura = c.intid_Cobertura 
    LEFT JOIN 
        tblcobertura c ON p.intid_Cobertura = c.intid_Cobertura

    -- 3. JOIN CATEGORÍA: p.intid_Categoria = cat.intid_Categoria 
    LEFT JOIN 
        tblcategoria cat ON p.intid_Categoria = cat.intid_Categoria
    WHERE
        p.Estado = 1
    
    ORDER BY 
        p.vchNombre ASC
";

$result = $conn->query($sql);
$productos = array(); 

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
    echo json_encode($productos, JSON_UNESCAPED_UNICODE);
} else {
    echo json_encode([]);
}

$conn->close();