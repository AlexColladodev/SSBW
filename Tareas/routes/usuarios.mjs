import express from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"
import logger from "../logger.mjs"

const router = express.Router()
const prisma = new PrismaClient()

router.get("/login", (req, res) => {
    res.render("login.njk")
})

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
            maxAge: 2 * 60 * 60 * 1000
        })

        res.locals.usuario = user.nombre
        res.locals.rol = user.rol

        logger.info(`🔐 Login correcto de: ${user.nombre}`)
        res.redirect("/")
    } catch (err) {
        logger.error("Error en login: " + err.message)
        res.status(500).send("Error interno")
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie("access_token")
    logger.info("🚪 Logout exitoso")
    res.redirect("/")
})

router.get("/registro", (req, res) => {
    res.render("registro.njk")
})

router.post("/registro", async (req, res) => {
    const { correo, nombre, password } = req.body
    try {
        const yaExiste = await prisma.usuario.findUnique({ where: { correo } })
        if (yaExiste) return res.render("login.njk", { error: "Usuario ya existe" })

        const hash = await bcrypt.hash(password, 10)

        await prisma.usuario.create({
            data: { correo, nombre, password: hash }
        })

        logger.info(`📝 Usuario registrado: ${correo}`)
        res.redirect("/usuarios/login")
    } catch (err) {
        logger.error("Error en registro: " + err.message)
        res.status(500).send("Error al registrar usuario")
    }
})

export default router
