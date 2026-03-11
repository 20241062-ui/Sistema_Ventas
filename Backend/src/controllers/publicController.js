import db from '../config/BD.js';

export const obtenerPoliticas = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT vchtitulo, vchcontenido FROM tblpoliticas ORDER BY intid ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener políticas:', error);
        res.status(500).json({ message: 'Error al obtener los datos del servidor.' });
    }
};
export const obtenerFAQ = async (req, res) => {
    try {
        // Filtramos por estado = 1 como en tu PHP original
        const [rows] = await db.query(
            'SELECT vchpregunta, vchrespuesta FROM tblpreguntasfrecuentes WHERE estado = 1 ORDER BY intid ASC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener FAQ:', error);
        res.status(500).json({ message: 'Error al obtener las preguntas frecuentes.' });
    }
};
export const obtenerNosotros = async (req, res) => {
    try {
        // Consultamos la tabla donde guardas la historia y el equipo
        // Ajusta los nombres de las columnas (vchseccion, vchcontenido) según tu BD
        const [rows] = await db.query('SELECT vchseccion as titulo, vchcontenido as contenido FROM tblnosotros ORDER BY intid ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener info de nosotros:', error);
        res.status(500).json({ message: 'Error al obtener los datos de la empresa.' });
    }
};
export const obtenerSucursales = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM tblsucursales');
        
        // Procesamos los links de los mapas para que funcionen en iframes
        const sucursales = rows.map(s => ({
            ...s,
            vchlink_mapa: s.vchlink_mapa.replace('/viewer?', '/embed?')
        }));
        
        res.json(sucursales);
    } catch (error) {
        console.error('Error al obtener sucursales:', error);
        res.status(500).json({ message: 'Error al obtener la ubicación de las sucursales.' });
    }
};
// Obtener información de contacto
export const obtenerContactoInfo = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT vchcampo, vchvalor FROM tblcontacto_info');
        // Convertimos el array de filas en un objeto fácil de usar en el front
        const info = {};
        rows.forEach(row => {
            info[row.vchcampo.toLowerCase()] = row.vchvalor;
        });
        res.json(info);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener información de contacto.' });
    }
};

// Recibir mensaje del formulario
export const enviarMensajeContacto = async (req, res) => {
    const { nombre, correo, mensaje } = req.body;
    try {
        // Aquí podrías insertar en una tabla de mensajes si la tienes
        // await db.query('INSERT INTO tblmensajes (nombre, correo, mensaje) VALUES (?, ?, ?)', [nombre, correo, mensaje]);
        
        console.log(`Mensaje recibido de ${nombre}: ${mensaje}`);
        res.json({ success: true, message: '¡Gracias! Tu mensaje ha sido enviado con éxito.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Hubo un error al enviar tu mensaje.' });
    }
};