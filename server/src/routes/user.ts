import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { User } from "../entities/user.entity";

const router = express.Router();
const userRepository = AppDataSource.getRepository(User);

router
    .get("/", async (req: Request, res: Response) => {
        try {
            const users = await userRepository.find();
            res.json(users);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error.message);
            res.status(500).json({ message: "Erro ao buscar usuários.", error: error.message });
        }
    })
    .get("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = parseInt(req.params.id, 10);

            if (isNaN(userId)) {
                return res.status(400).json("ID de usuário inválido.");
            }

            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json("Usuário não encontrado.");
            }

            res.status(200).json(user);
        } catch (error) {
            console.error("Erro ao buscar usuário:", error);
            res.status(500).json("Erro ao buscar usuário.");
        }
    })
    .post("/", async (req: Request, res: Response) => {
        try {
            const user = userRepository.create({
                nome: req.body.nome,
                email: req.body.email,
                telefone: req.body.telefone,
                dataNascimento: req.body.dataNascimento,
            });

            await userRepository.save(user);
            res.status(201).json(user);
        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            res.status(500).json("Erro ao criar usuário.");
        }
    })
    .put("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = parseInt(req.params.id, 10);

            if (isNaN(userId)) {
                return res.status(400).json("ID de usuário inválido.");
            }

            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json("Usuário não encontrado.");
            }

            user.nome = req.body.nome || user.nome;
            user.email = req.body.email || user.email;
            user.telefone = req.body.telefone || user.telefone;
            user.dataNascimento = req.body.dataNascimento || user.dataNascimento;

            await userRepository.save(user);
            res.status(200).json(user);
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            res.status(500).json("Erro ao atualizar usuário.");
        }
    })
    .delete("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const userId = parseInt(req.params.id, 10);

            if (isNaN(userId)) {
                return res.status(400).json("ID de usuário inválido.");
            }

            const user = await userRepository.findOneBy({ id: userId });
            if (!user) {
                return res.status(404).json("Usuário não encontrado.");
            }

            await userRepository.remove(user);
            res.status(200).json("Usuário deletado com sucesso.");
        } catch (error) {
            console.error("Erro ao deletar usuário:", error);
            res.status(500).json("Erro ao deletar usuário.");
        }
    });

export default router;
