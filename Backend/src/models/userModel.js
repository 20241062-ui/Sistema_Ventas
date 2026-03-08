const db = require('../config/db'); // Tu archivo de conexión

const User = {
    // Buscar usuario por correo para el login
    findByEmail: (email, callback) => {
        const sql = "SELECT id_usuario, vchnombre, vchpassword, vchRol FROM tblusuario WHERE vchcorreo = ? AND Estado = 1";
        db.query(sql, [email], callback);
    }
};

module.exports = User;