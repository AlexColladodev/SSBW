import express from 'express'
import nunjucks from 'nunjucks'
import obrasRouter from "./routes/obras.mjs"
import cookieParser from "cookie-parser"
import jwt from "jsonwebtoken"
import usuariosRouter from "./routes/usuarios.mjs"
import { PrismaClient } from '@prisma/client'
import apiRouter from "./routes/api.mjs";


const prisma = new PrismaClient()
const IN = process.env.IN || 'development'
const app = express()

nunjucks.configure('views', {
    autoescape: true,
    noCache: IN === 'development',
    watch: IN === 'development',
    express: app
})

app.set('view engine', 'njk')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

const autentificación = (req, res, next) => {
    const token = req.cookies.access_token
    if (token) {
        try {
            const data = jwt.verify(token, process.env.SECRET_KEY)
            req.usuario = data.usuario
            req.rol = data.rol
            res.locals.usuario = data.usuario
            res.locals.rol = data.rol
            console.log('🧠 En el request:', req.usuario, req.rol)
        } catch (err) {
            console.warn("⚠️ Token inválido o expirado")
        }
    }
    next()
}

app.use(autentificación)

app.use("/obras", obrasRouter)
app.use("/usuarios", usuariosRouter)
app.use("/api", apiRouter);


app.get('/', async (req, res) => {
    try {
        const obras = await prisma.obra.findMany();
        res.render('index.njk', { obras });
    } catch (err) {
        console.error("Error cargando obras:", err);
        res.status(500).send("Error al cargar la página principal.");
    }
});

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`)
})
