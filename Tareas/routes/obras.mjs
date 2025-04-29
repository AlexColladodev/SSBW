import express from "express"
import { PrismaClient } from "@prisma/client"
import logger from "../logger.mjs"

const router = express.Router()
const prisma = new PrismaClient()

router.get('/buscar', async (req, res) => {
    const búsqueda = req.query.búsqueda?.trim().toLowerCase()
    if (!búsqueda) return res.redirect("/")

    try {
        const todas = await prisma.obra.findMany()
        const coincidencias = todas.filter(obra => {
            const texto = `${obra.título} ${obra.descripción} ${obra.comentario}`.toLowerCase()
            return texto.includes(búsqueda)
        })

        const ordenadas = coincidencias
            .map(obra => {
                const texto = `${obra.título} ${obra.descripción} ${obra.comentario}`.toLowerCase()
                const puntos = texto.split(búsqueda).length - 1
                return { ...obra, puntos }
            })
            .sort((a, b) => b.puntos - a.puntos)
            .slice(0, 3)

        logger.info(`🔎 Búsqueda realizada: "${búsqueda}" → ${ordenadas.length} resultado(s)`)
        res.render('resultados.njk', { obras: ordenadas, búsqueda })
    } catch (err) {
        logger.error("❌ Error en la búsqueda: " + err.message)
        res.status(500).send("Error interno al buscar")
    }
})

router.get('/:id', async (req, res) => {
    try {
        const obra = await prisma.obra.findUnique({
            where: { id: parseInt(req.params.id) }
        })

        if (!obra) {
            return res.status(404).send("Obra no encontrada")
        }

        res.render('obra.njk', { obra })
    } catch (err) {
        console.error("❌ Error al mostrar obra:", err)
        res.status(500).send("Error interno del servidor")
    }
})


export default router
