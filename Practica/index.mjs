// index.mjs
import express from 'express'
import nunjucks from 'nunjucks'

const IN = process.env.IN || 'development' // development o production
const app = express()

nunjucks.configure('views', {             // directorio 'views' para las plantillas html
    autoescape: true,
    noCache: IN === 'development',       // true para desarrollo, sin cache
    watch: IN === 'development',       // reinicio con Ctrl-S
    express: app
})
app.set('view engine', 'html')

app.get('/hola', (req, res) => {          // test para el servidor
    res.send('Hola desde el servidor');
});

app.get('/', (req, res) => {               // test plantillas en: 
    res.render("index.html", { saludado: 'Pepito' })           // ./views/index.html
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutandose en  http://localhost:${PORT} en ${IN}`);
})