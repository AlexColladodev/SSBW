const express = require('express');
const nunjucks = require('nunjucks');

const app = express();
const PORT = 3000;

// Configurar Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Configurar la carpeta de vistas
app.set('view engine', 'njk');

// Ruta principal
app.get('/', (req, res) => {
    res.render('index', { titulo: 'Hola desde Nunjucks' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
