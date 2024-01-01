import { createPool } from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

    console.log(">LOGEO USUARIO> Datos recibidos: ");
    console.log("user:" + username, "pass: " + password);


});

// Ruta para crear
app.post('/crear', async (req, res) => {
    const { username, password } = req.body;

    console.log(">CREAR USUARIO> Datos recibidos: ");
    console.log("user:" + username, "pass: " + password);


});

// Ruta para modificar
app.post('/modificar', async (req, res) => {
    const { username, password } = req.body;

    console.log(">MODIFICAR USUARIO> Datos recibidos: ");
    console.log("user:" + username, "pass: " + password);


});

// Ruta para eliminar
app.post('/eliminar', async (req, res) => {
    const { username, password } = req.body;

    console.log(">ELIMINAR USUARIO> Datos recibidos: ");
    console.log("user:" + username, "pass: " + password);
});

// Ruta para eliminar
app.post('/buscar', async (req, res) => {
    const { username } = req.body;

    console.log(">BUSCAR USUARIO> Datos recibidos: ");
    console.log("user:" + username);
});

app.listen(3000)
