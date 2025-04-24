import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const router = express.Router()
const prisma = new PrismaClient()

// GET /usuarios/login — muestra formulario de login
router.get("/login", (req, res) => {
    res.render("login.njk")
})

// POST /usuarios/login — procesa login
router.post("/login", async (req, res) => {
    const { correo, password } = req.body

    try {
        const user = await prisma.usuario.findUnique({ where: { correo } })
        if (!user) return res.render("login.njk", { error: "Usuario no encontrado" })

        const valido = await bcrypt.compare(password, user.password)
        if (!valido) return res.render("login.njk", { error: "Contraseña incorrecta" })

        const token = jwt.sign(
            { usuario: user.nombre, rol: user.rol },
            process.env.SECRET_KEY,
            { expiresIn: "2h" }
        )

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60 * 1000 // 2 horas
        })

        res.locals.usuario = user.nombre
        res.locals.rol = user.rol

        res.redirect("/")
    } catch (err) {
        console.error("❌ Error en login:", err)
        res.status(500).send("Error interno")
    }
})

// GET /usuarios/logout — borra la cookie
router.get("/logout", (req, res) => {
    res.clearCookie("access_token")
    res.redirect("/")
})

// GET /usuarios/registro — muestra el formulario
router.get('/registro', (req, res) => {
    res.render('registro.njk')
})


// POST /usuarios/registro — crea nuevo usuario
router.post("/registro", async (req, res) => {
    const { correo, nombre, password } = req.body

    try {
        const yaExiste = await prisma.usuario.findUnique({ where: { correo } })
        if (yaExiste) return res.render("login.njk", { error: "Usuario ya existe" })

        const hash = await bcrypt.hash(password, 10)

        await prisma.usuario.create({
            data: { correo, nombre, password: hash }
        })

        res.redirect("/usuarios/login")
    } catch (err) {
        console.error("❌ Error en registro:", err)
        res.status(500).send("Error al registrar usuario")
    }
})

export default router
