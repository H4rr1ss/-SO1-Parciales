import { createPool } from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import path from 'path';


const app = express();
const __filename = fileURLToPath(import.meta.url);
app.use(express.urlencoded({ extended: true }));
const __dirname = dirname(__filename);
app.use(express.json());

const pool = createPool({
    host: "mysqldb_hgomez202103718",
    user: "root",
    password: "12345",
    database: "hgomez202103718",
    port: 3306,// Se coloca el puerto del contenedor
    connectionLimit: 10,
});

// Ruta para verificar si conecta la base de datos
app.get("/ping", async (req, res) => {
    const result = await pool.query("SELECT NOW()")
    console.log("ESTO ES UNA PRUEBA DE CONEXION A LA BASE DE DATOS")
    res.json(result[0])
});

// Ruta a la carpeta 'frontend'
const frontendPath = path.join(__dirname, 'frontend');
// Configuración para servir archivos estáticos desde la carpeta 'frontend'
app.use(express.static(frontendPath));

// Ruta para el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ruta para el login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [result] = await pool.query(
            'SELECT * FROM users WHERE username = ? AND password = ?',
            [username, password]
        );

        if (result.length > 0) {
            res.send("Login correcto!");
        } else {
            res.send("Login incorrecto!");
        }
    } catch (error) {
        res.send("Ocurrió un error!");
    }
});

// Ruta para crear
app.post('/crear', async (req, res) => {
    const { username, password } = req.body;

    console.log("> CREAR USUARIO > Datos recibidos: ");
    console.log("user: " + username, "pass: " + password);

    const newUser = {
        username: username,
        password: password,
    };

    try {
        // Verificar si el nombre de usuario ya existe en la base de datos
        const [existingRows] = await pool.query('SELECT * FROM users WHERE username = ?', [newUser.username]);

        if (existingRows.length > 0) {
            // El nombre de usuario ya existe, enviar una respuesta de error al cliente
            res.status(400).json({ error: 'Nombre de usuario ya existe' });
            return;
        }

        // El nombre de usuario no existe, proceder con la inserción
        const [result] = await pool.query(
            'INSERT INTO users (username, password) VALUES (?, ?)',
            [newUser.username, newUser.password]
        );

        // Enviar una respuesta exitosa al cliente
        res.status(200).json({ message: 'Usuario creado con éxito' });
    } catch (e) {
        console.error("OCURRIÓ UN ERROR AL CREAR USUARIO:", e);
        // Enviar una respuesta de error al cliente
        res.status(500).json({ error: 'Error interno del servidor al crear usuario' });
    }
});


// Ruta para modificar
app.post('/modificar', async (req, res) => {
    const { buscaruser, username, password } = req.body;

    console.log("> MODIFICAR USUARIO > Datos recibidos: ");
    console.log("Buscar usuario: " + buscaruser, "Nuevo username: " + username, "Nuevo password: " + password);

    try {
        // Verificar si el usuario que se desea modificar existe
        const [existingRows] = await pool.query('SELECT * FROM users WHERE username = ?', [buscaruser]);

        if (existingRows.length > 0) {
            // El usuario existe, proceder con la actualización
            await pool.query('UPDATE users SET username = ?, password = ? WHERE username = ?', [username, password, buscaruser]);

            console.log('Usuario modificado exitosamente');

            // Enviar una respuesta exitosa al cliente
            res.status(200).json({ message: 'Usuario modificado exitosamente' });
        } else {
            // El usuario no existe, enviar una respuesta indicando que no se pudo realizar la modificación
            console.log('Usuario no encontrado, no se pudo modificar');
            res.status(404).json({ message: 'Usuario no encontrado, no se pudo modificar' });
        }
    } catch (e) {
        // Manejar errores
        console.error("OCURRIÓ UN ERROR AL MODIFICAR USUARIO:", e);

        // Enviar una respuesta de error al cliente
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});



// Ruta para eliminar
app.post('/eliminar', async (req, res) => {
    const { username } = req.body;

    console.log("> ELIMINAR USUARIO > Datos recibidos: ");
    console.log("user: " + username);

    try {
        // Verificar si el usuario existe antes de intentar eliminarlo
        const [existingRows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (existingRows.length > 0) {
            // El usuario existe, proceder con la eliminación
            await pool.query('DELETE FROM users WHERE username = ?', [username]);

            console.log('Usuario eliminado exitosamente');

            // Enviar una respuesta exitosa al cliente
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
        } else {
            // El usuario no existe, enviar una respuesta indicando que no se pudo realizar la eliminación
            console.log('Usuario no encontrado, no se pudo eliminar');
            res.status(404).json({ message: 'Usuario no encontrado, no se pudo eliminar' });
        }
    } catch (e) {
        // Manejar errores
        console.error("OCURRIÓ UN ERROR AL ELIMINAR USUARIO:", e);

        // Enviar una respuesta de error al cliente
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Ruta para eliminar
app.post('/buscar', async (req, res) => {
    const { username } = req.body;

    console.log(">BUSCAR USUARIO> Datos recibidos: ");
    console.log("user:" + username);

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length > 0) {
            const user = rows[0];
            console.log('Datos del usuario encontrado:');
            console.log('ID:', user.id);
            console.log('Username:', user.username);
            console.log('Password:', user.password);

            // Enviar los datos encontrados como respuesta al cliente
            res.status(200).json({
                id: user.id,
                username: user.username,
                password: user.password
            });
        } else {
            console.log('Usuario no encontrado');
            // Enviar una respuesta indicando que el usuario no fue encontrado
            res.status(404).json({ error: 'Usuario no encontrado' });
        }

    } catch (e) {
        console.error("OCURRIO UN ERROR AL BUSCAR USUARIO:", e);
        // Enviar una respuesta de error al cliente
        res.status(500).json({ error: 'Ocurrió un error al buscar el usuario' });
    }
});


app.listen(3000)
