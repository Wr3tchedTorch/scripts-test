import express, { Request, Response } from "express";
import { AppDataSource } from "../database/config";
import { Produto } from "../entities/produto.entity";

const router = express.Router();
const produtoRepository = AppDataSource.getRepository(Produto);

router
    .get("/", async (req: Request, res: Response) => {
        try {
            const produtos = await produtoRepository.find();
            res.json(produtos);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error.message);
            res.status(500).json({ message: "Erro ao buscar produtos.", error: error.message });
        }
    })
    .get("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const produtoId = parseInt(req.params.id, 10);

            if (isNaN(produtoId)) {
                return res.status(400).json("ID de produto inválido.");
            }

            const produto = await produtoRepository.findOneBy({ id: produtoId });
            if (!produto) {
                return res.status(404).json("Produto não encontrado.");
            }

            res.status(200).json(produto);
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
            res.status(500).json("Erro ao buscar produto.");
        }
    })
    .post("/", async (req: Request, res: Response) => {
        try {
            const produto = produtoRepository.create({
                nome: req.body.nome,
                descricao: req.body.descricao,
                preco: req.body.preco,
                quantidadeEmEstoque: req.body.quantidadeEmEstoque,
                categoria: req.body.categoria,
            });

            await produtoRepository.save(produto);
            res.status(201).json(produto);
        } catch (error) {
            console.error("Erro ao criar produto:", error);
            res.status(500).json("Erro ao criar produto.");
        }
    })
    .put("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const produtoId = parseInt(req.params.id, 10);

            if (isNaN(produtoId)) {
                return res.status(400).json("ID de produto inválido.");
            }

            const produto = await produtoRepository.findOneBy({ id: produtoId });
            if (!produto) {
                return res.status(404).json("Produto não encontrado.");
            }

            produto.nome = req.body.nome || produto.nome;
            produto.descricao = req.body.descricao || produto.descricao;
            produto.preco = req.body.preco || produto.preco;
            produto.quantidadeEmEstoque = req.body.quantidadeEmEstoque || produto.quantidadeEmEstoque;
            produto.categoria = req.body.categoria || produto.categoria;

            await produtoRepository.save(produto);
            res.status(200).json(produto);
        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            res.status(500).json("Erro ao atualizar produto.");
        }
    })
    .delete("/:id", async (req: Request, res: Response): Promise<any> => {
        try {
            const produtoId = parseInt(req.params.id, 10);

            if (isNaN(produtoId)) {
                return res.status(400).json("ID de produto inválido.");
            }

            const produto = await produtoRepository.findOneBy({ id: produtoId });
            if (!produto) {
                return res.status(404).json("Produto não encontrado.");
            }

            await produtoRepository.remove(produto);
            res.status(200).json("Produto deletado com sucesso.");
        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            res.status(500).json("Erro ao deletar produto.");
        }
    });

export default router;