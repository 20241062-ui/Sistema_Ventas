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
        p.vchNombre AS Nombre,
        p.vchDescripcion AS Descripcion,
        p.Estado, 
        p.floPrecioUnitario  AS Precio,
        p.intStock  AS Stock,
        p.floPrecioCompra, 
        p.vchImagen AS Imagen,
        
        -- IDs (FKs) de tblproductos
        p.intid_Marca AS Marca,
        p.intid_Cobertura, 
        p.intid_Categoria AS Categoria,

        -- 🎯 CAMPOS DE TEXTO OBTENIDOS POR JOIN
        
        -- De tblmarcas: Usamos vchNombre como el nombre de la Marca
        m.vchNombre AS vchMarca,      
        
        -- De tblcobertura: Usamos vchTipoCobertura como el valor de la Cobertura
        c.vchTipoCobertura AS vchCobertura,
        c.intMeses_Cobertura,
        
        -- De tblcategoria: Usamos vchNombre como el nombre de la Categoría
        cat.vchNombre AS vchCategoria 
        
    FROM 
        tblproductos p
    
    -- 1. JOIN MARCA: p.intid_Marca = m.intid_Marca (Claves correctas)
    LEFT JOIN 
        tblmarcas m ON p.intid_Marca = m.intid_Marca
        
    -- 2. JOIN COBERTURA: p.intid_Cobertura = c.intid_Cobertura (Claves correctas)
    LEFT JOIN 
        tblcobertura c ON p.intid_Cobertura = c.intid_Cobertura

    -- 3. JOIN CATEGORÍA: p.intid_Categoria = cat.intid_Categoria (Claves correctas)
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