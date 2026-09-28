import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { error } from "console";
const router = Router();

// Cadastrar um instrutor novo
router.post("/", async (req: Request, res: Response) => {
    try {
        const { id, nome, email } = req.body;

        if ( !nome || !email ) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios." });
        }

        const instrutorSalvo = await prisma.instrutor.create({
            data: {
                id,
                nome,
                email,
            }
        });
    res.status(201).json(instrutorSalvo);

    } catch (error) {
        console.error("erro ao cadastrar instrutor:", error);
        res.status(500).json("Erro interno do servidor");
    }
})

// Listar todos os instrutores
router.get("/", async (req: Request, res: Response) => {
    try {
        const instrutores = await prisma.instrutor.findMany();
        res.status(200).json(instrutores);

    } catch (error) {
        console.error("Erro ao listar instrutores:", error);
        res.status(500).json("Erro interno do servidor");
    }
})

// Buscar um instrutor pelo ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const instrutor = await prisma.instrutor.findUnique({
            where: { id: Number(req.params.id)}
        })
    
        if (!instrutor) {
            return res.status(404).json({ error: "Instrutor não encontrado."});
        }
        res.json(instrutor);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { nome, email, cursos } = req.body;

        const instrutor = await prisma.instrutor.update({
            where: { id: Number(req.params.id)},
            data: { nome, email, cursos }
        })
        res.json(instrutor);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await prisma.instrutor.delete({
            where: { id: Number(req.params.id)}
        })
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})



export default router;