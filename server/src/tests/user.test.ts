import { describe, it, beforeEach, afterEach } from "node:test";
import { strict as assert } from "node:assert";
import { AppDataSource } from "src/database/config";
import app from "../app";
import request from "supertest";
import { User } from "src/entities/user.entity";

const BASE_URL = "/usuarios/";

beforeEach(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }

    await AppDataSource.initialize();

    await AppDataSource.getRepository(User).clear();

    const users = [
        {
            nome: "User A",
            email: "usera@example.com",
            telefone: "123456789",
            dataNascimento: "1990-01-01",
        },
        {
            nome: "User B",
            email: "userb@example.com",
            telefone: "987654321",
            dataNascimento: "1995-05-05",
        }
    ];

    for (const user of users) {
        await AppDataSource.getRepository(User).save(user);
    }
});

afterEach(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});

describe("Testing the User CRUD router", () => {

    describe("GET request", () => {
        it("should get all users", async () => {
            const res = await request(app)
                .get(`${BASE_URL}`)
                .expect("Content-Type", /json/)
                .expect(200);

            assert.ok(Array.isArray(res.body), "Resposta deveria ser um array de usuários");
        });

        it("should return error for invalid ID", async () => {
            const res = await request(app)
                .get(`${BASE_URL}-1`)
                .expect("Content-Type", /json/)
                .expect(404);

            assert.strictEqual(res.status, 404, "Resposta deveria retornar código 404 para ID inválido");
        });
    });

    describe("POST request", () => {
        it("should create a new user with correct data", async () => {
            const newUser = {
                nome: "User C",
                email: "userc@example.com",
                telefone: "1122334455",
                dataNascimento: "2000-02-02",
            };

            const res = await request(app)
                .post(`${BASE_URL}`)
                .send(newUser)
                .expect("Content-Type", /json/)
                .expect(201);

            assert.ok(res.body.id, "Resposta deveria conter o ID do novo usuário");
            assert.strictEqual(res.body.nome, newUser.nome, "Nome do usuário não corresponde");
        });
    });

    describe("DELETE request", () => {
        it("should delete the user", async () => {
            const tempUser = {
                nome: "User Temporário",
                email: "temporaryuser@example.com",
                telefone: "9988776655",
                dataNascimento: "1980-08-08",
            };

            const createRes = await request(app)
                .post(`${BASE_URL}`)
                .send(tempUser)
                .expect(201);

            const userId = createRes.body.id;

            const deleteRes = await request(app)
                .delete(`${BASE_URL}${userId}`)
                .expect(200);

            assert.strictEqual(deleteRes.status, 200, "Status de exclusão deveria ser 200");

            const getRes = await request(app)
                .get(`${BASE_URL}${userId}`)
                .expect(404);

            assert.strictEqual(getRes.status, 404, "Usuário excluído deveria retornar 404");
        });
    });

    describe("PUT request", () => {
        it("should update the user details", async () => {
            const tempUser = {
                nome: "User Antigo",
                email: "olduser@example.com",
                telefone: "1234123412",
                dataNascimento: "1975-07-07",
            };

            const createRes = await request(app)
                .post(`${BASE_URL}`)
                .send(tempUser)
                .expect(201);

            const userId = createRes.body.id;

            const updatedUser = {
                nome: "User Atualizado",
                email: "updateduser@example.com"
            };

            const updateRes = await request(app)
                .put(`${BASE_URL}${userId}`)
                .send(updatedUser)
                .expect(200);

            assert.strictEqual(updateRes.body.nome, updatedUser.nome, "Nome do usuário não foi atualizado corretamente");
            assert.strictEqual(updateRes.body.email, updatedUser.email, "Email do usuário não foi atualizado corretamente");
        });
    });
});
