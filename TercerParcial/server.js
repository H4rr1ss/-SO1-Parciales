import { createPool } from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.urlencoded({ extended: true }));

const pool = createPool({
    host: "mysqldb_hgomez202103718",
    user: "root",
    password: "12345",
    database: "hgomez202103718",
    port: 3306,// Se coloca el puerto del contenedor
    connectionLimit: 10,
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

    console.log(">>>++> Datos recibidos: ");
    console.log(username, password);

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

// Ruta para verificar si conecta la base de datos
app.get("/ping", async (req, res) => {
    const result = await pool.query("SELECT NOW()")
    res.json(result[0])
});

// Ruta para obtener datos desde la tabla
app.get("/data", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (error) {
        console.error('-+-+-+-+-+-+-+-+-Error al obtener datos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(3000)
console.log('Server running on port 3000');
