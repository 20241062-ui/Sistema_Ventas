<?php
// Inicia el búfer de salida
ob_start();
// Configuración de reporte de errores para evitar que las notificaciones PHP contaminen el JSON
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

// Establece el encabezado para indicar que la respuesta es JSON
header('Content-Type: application/json');

// Incluye el archivo de conexión a la base de datos
// Se asume que este archivo define $conn
include_once __DIR__ . '/Conexion.php';

// 1. Recolección de parámetros POST
$action = $_POST['action'] ?? null;
// Nuevos campos para registro y login
$nombre = $_POST['vchnombre'] ?? null;
$apellido = $_POST['vchapellido'] ?? null;
$correo = $_POST['vchcorreo'] ?? null;
$password = $_POST['vchpassword'] ?? null;

$datos = array();

// 2. Verificación inicial de la conexión
if (!isset($conn) || $conn->connect_error) {
    $datos[] = array('Estado' => "false", 'Salida' => 'Error interno del servidor: Fallo en la conexión a la base de datos.');
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit;
}

// 3. Validación de parámetros mínimos
if (!$action || !$correo || !$password) {
    $datos[] = array('Estado' => "false", 'Salida' => 'Faltan parámetros de acción, correo o contraseña.');
} elseif ($action == "registrar") {

    // --- Lógica de Registro ---
    
    // Validar si el correo ya existe
    $check_sql = "SELECT id_usuario FROM tblusuario WHERE vchcorreo = ?";
    $check_stmt = $conn->prepare($check_sql);
    $check_stmt->bind_param("s", $correo);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        $datos[] = array('Estado' => "false", 'Salida' => 'El correo electrónico ya está registrado.');
    } else {
        // Cifrar la contraseña
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        // Rol por defecto: 'cliente' (según la solicitud)
        $rol = 'cliente';

        // Consulta de inserción en tblusuario, incluyendo todos los campos y el rol por defecto
        $sql = "INSERT INTO tblusuario (vchnombre, vchapellido, vchcorreo, vchpassword, vchRol) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        // Nota: El tipo de los parámetros debe coincidir con el tipo de dato en la base de datos (s = string)
        $stmt->bind_param("sssss", $nombre, $apellido, $correo, $passwordHash, $rol);

        if ($stmt->execute()) {
            $datos[] = array('Estado' => "true", 'Salida' => 'Usuario registrado como cliente exitosamente.');
        } else {
            // Muestra un error más detallado si la ejecución falla
            $datos[] = array('Estado' => "false", 'Salida' => 'Error al registrar el usuario: ' . $stmt->error);
        }
        $stmt->close();
    }
    if (isset($check_stmt)) {
        $check_stmt->close();
    }

} elseif ($action == "login") {

    // --- Lógica de Login ---
    
    // Seleccionar la ID y la contraseña cifrada usando el correo
    $stmt = $conn->prepare("SELECT id_usuario, vchpassword FROM tblusuario WHERE vchcorreo = ?");
    $stmt->bind_param("s", $correo);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Verificar la contraseña cifrada
        if (password_verify($password, $user['vchpassword'])) {
            $datos[] = array("Estado" => "Correcto", "Salida" => "Usuario existente", "user_id" => $user['id_usuario']);
        } else {
            $datos[] = array("Estado" => "Incorrecto", "Salida" => "Contraseña incorrecta", "user_id" => 0);
        }
    } else {
        $datos[] = array("Estado" => "error", "Salida" => "Usuario no encontrado", "user_id" => 0);
    }
    $stmt->close();
    
} else {
    // Acción no reconocida
    $datos[] = array('Estado' => "false", 'Salida' => 'Acción no válida.');
}

// Limpia el búfer de salida y genera el JSON
ob_clean();
echo json_encode($datos, JSON_UNESCAPED_UNICODE);

// Cierra la conexión
$conn->close();
?>