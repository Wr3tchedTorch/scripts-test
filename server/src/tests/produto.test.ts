import { describe, it, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { AppDataSource } from "src/database/config";
import app from "../app";
import request from "supertest";
import { Produto } from "src/entities/produto.entity";

const baseURL = "/produtos";

beforeEach(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }

    await AppDataSource.initialize();

    await AppDataSource.getRepository(Produto).clear();

    const produtos = [
        {
            nome: "Produto A",
            descricao: "Descrição do Produto A",
            preco: 10.0,
            quantidadeEmEstoque: 100,
            categoria: "Categoria A"
        },
        {
            nome: "Produto B",
            descricao: "Descrição do Produto B",
            preco: 20.0,
            quantidadeEmEstoque: 50,
            categoria: "Categoria B"
        }
    ];

    for (const produto of produtos) {
        await AppDataSource.getRepository(Produto).save(produto);
    }
});

afterEach(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

describe("Testing the Produto CRUD router", () => {

    describe("GET request", () => {
        it("should get all produtos", async () => {
            const res = await request(app)
                .get("/produtos/")
                .expect("Content-Type", /json/)
                .expect(200);

            assert.ok(Array.isArray(res.body), "Resposta deveria ser um array de produtos");
        });

        it("should return error for invalid ID", async () => {
            const res = await request(app)
                .get("/produtos/-1")
                .expect("Content-Type", /json/)
                .expect(404);

            assert.strictEqual(res.status, 404, "Resposta deveria retornar código 404 para ID inválido");
        });
    });

    describe("POST request", () => {
        it("should create a new produto with correct data", async () => {
            const newProduto = {
                nome: "Produto C",
                descricao: "Descrição do Produto C",
                preco: 30.0,
                quantidadeEmEstoque: 75,
                categoria: "Categoria C"
            };

            const res = await request(app)
                .post("/produtos/")
                .send(newProduto)
                .expect("Content-Type", /json/)
                .expect(201);

            assert.ok(res.body.id, "Resposta deveria conter o ID do novo produto");
            assert.strictEqual(res.body.nome, newProduto.nome, "Nome do produto não corresponde");
        });
    });

    describe("DELETE request", () => {
        it("should delete the produto", async () => {
            const tempProduto = {
                nome: "Produto Temporário",
                descricao: "Descrição temporária",
                preco: 15.0,
                quantidadeEmEstoque: 10,
                categoria: "Categoria Temporária"
            };

            const createRes = await request(app)
                .post("/produtos/")
                .send(tempProduto)
                .expect(201);

            const produtoId = createRes.body.id;

            const deleteRes = await request(app)
                .delete(`/produtos/${produtoId}`)
                .expect(200);

            assert.strictEqual(deleteRes.status, 200, "Status de exclusão deveria ser 200");

            const getRes = await request(app)
                .get(`/produtos/${produtoId}`)
                .expect(404);

            assert.strictEqual(getRes.status, 404, "Produto excluído deveria retornar 404");
        });
    });

    describe("PUT request", () => {
        it("should update the produto details", async () => {
            const tempProduto = {
                nome: "Produto Antigo",
                descricao: "Descrição antiga",
                preco: 40.0,
                quantidadeEmEstoque: 60,
                categoria: "Categoria Antiga"
            };

            const createRes = await request(app)
                .post("/produtos/")
                .send(tempProduto)
                .expect(201);

            const produtoId = createRes.body.id;

            const updatedProduto = {
                nome: "Produto Atualizado",
                preco: 45.0
            };

            const updateRes = await request(app)
                .put(`/produtos/${produtoId}`)
                .send(updatedProduto)
                .expect(200);

            assert.strictEqual(updateRes.body.nome, updatedProduto.nome, "Nome do produto não foi atualizado corretamente");
            assert.strictEqual(updateRes.body.preco, updatedProduto.preco, "Preço do produto não foi atualizado corretamente");
        });
    });
});
