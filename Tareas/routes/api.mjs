import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/usuario/:correo
router.get("/usuario/:correo", async (req, res) => {
    try {
        const usuario = await prisma.usuario.findUnique({
            where: { correo: req.params.correo }
        });
        res.json({ ok: true, data: usuario !== null });
    } catch (err) {
        console.error("Error buscando usuario:", err);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
});

// GET /api/obra/cuantas
router.get("/obra/cuantas", async (req, res) => {
    try {
        const total = await prisma.obra.count();
        res.json({ ok: true, data: total });
    } catch (err) {
        console.error("Error contando obras:", err);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
});

// GET /api/obra?desde=0&hasta=10
router.get("/obra", async (req, res) => {
    const desde = parseInt(req.query.desde) || 0;
    const hasta = parseInt(req.query.hasta) || 10;
    try {
        const obras = await prisma.obra.findMany({
            skip: desde,
            take: hasta - desde
        });
        res.json({ ok: true, data: obras });
    } catch (err) {
        console.error("Error listando obras:", err);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
});

// GET /api/obra/:id
router.get("/obra/:id", async (req, res) => {
    try {
        const obra = await prisma.obra.findUnique({
            where: { id: parseInt(req.params.id) }
        });
        if (!obra) {
            return res.status(404).json({ ok: false, msg: "Obra no encontrada" });
        }
        res.json({ ok: true, data: obra });
    } catch (err) {
        console.error("Error buscando obra:", err);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
});

// DELETE /api/obra/:id
router.delete("/obra/:id", async (req, res) => {
    try {
        const obra = await prisma.obra.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ ok: true, msg: "Obra eliminada", data: obra });
    } catch (err) {
        console.error("Error eliminando obra:", err);
        res.status(500).json({ ok: false, msg: "Error en el servidor" });
    }
});

export default router;
