import { Router, Request, Response } from "express";
import prisma from "../prismaClient";
import { error } from "console";
const router = Router();

// Cadastrar um curso novo
router.post("/", async (req: Request, res: Response) => {
    try {
        const { id, titulo, descricao, instrutorId } = req.body;

        if ( !titulo || !descricao || !instrutorId ) {
            return res.status(400).json({
                error: "Todos os campos são obrigatórios." });
        }

        const cursoSalvo = await prisma.curso.create({
            data: {
                id,
                titulo,
                descricao,
                InstrutorId: instrutorId,
            }
        });
    res.status(201).json(cursoSalvo);

    } catch (error) {
        console.error("erro ao cadastrar curso:", error);
        res.status(500).json("Erro interno do servidor");
    }
})

// Listar todos os cursos
router.get("/", async (req: Request, res: Response) => {
    try {
        const cursos = await prisma.curso.findMany();
        res.status(200).json(cursos);

    } catch (error) {
        console.error("Erro ao listar cursos:", error);
        res.status(500).json("Erro interno do servidor");
    }
})

// Buscar um curso pelo ID
router.get("/:id", async (req: Request, res: Response) => {
    try {
        const curso = await prisma.curso.findUnique({
            where: { id: Number(req.params.id)}
        })
    
        if (!curso) {
            return res.status(404).json({ error: "Curso não encontrado."});
        }
        res.json(curso);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})

router.put("/:id", async (req: Request, res: Response) => {
    try {
        const { titulo, descricao, InstrutorId, instrutor } = req.body;

        const curso = await prisma.curso.update({
            where: { id: Number(req.params.id)},
            data: { titulo, descricao, InstrutorId, instrutor }
        })
        res.json(curso);
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})

router.delete("/:id", async (req: Request, res: Response) => {
    try {
        await prisma.curso.delete({
            where: { id: Number(req.params.id)}
        })
        return res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: "Erro interno do servidor."});
    }
})



export default router;