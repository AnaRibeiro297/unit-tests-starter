//Exercicios 
//API /produtos (integracao com supertest)

const request = require("supertest");
const createApp = require("../app");

describe("API /produtos testes de integracao - Escrita", () => {
    let app;

    beforeEach(() => {
        app = createApp();
    });

    describe("POST /produtos", () => {
        test("deve retornar 201 e o produto criado com id gerado", async () => {
            const novoProduto = { nome: "Mouse Gamer", preco: 120 };

            const res = await request(app)
                .post("/produtos")
                .send(novoProduto);

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("id");
            expect(res.body.nome).toBe(novoProduto.nome);
            expect(res.body.preco).toBe(novoProduto.preco);
        });

        test("deve retornar 400 com { erro: ... } quando o nome estiver faltando", async () => {
            const res = await request(app)
                .post("/produtos")
                .send({ preco: 100 });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("erro");
        });

        test("deve retornar 400 com { erro: ... } quando o preco estiver faltando", async () => {
            const res = await request(app)
                .post("/produtos")
                .send({ nome: "Teclado" });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty("erro");
        });

        test("o produto criado deve aparecer em uma chamada seguinte a GET /produtos", async () => {
            const novoProduto = { nome: "Monitor", preco: 800 };

            const postRes = await request(app)
                .post("/produtos")
                .send(novoProduto);

            const getRes = await request(app).get("/produtos");

            expect(getRes.status).toBe(200);
            expect(getRes.body).toContainEqual(postRes.body);
        });
    });

    describe("DELETE /produtos/:id", () => {
        test("deve retornar 204 quando o produto e removido com sucesso", async () => {
            const res = await request(app).delete("/produtos/1");

            expect(res.status).toBe(204);

            const getRes = await request(app).get("/produtos/1");
            expect(getRes.status).toBe(404);
        });

        test("deve retornar 404 com { erro: ... } quando o produto nao existir", async () => {
            const res = await request(app).delete("/produtos/999");

            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty("erro");
        });
    });
});


//Esse é do professor 
// const request = require("supertest");
// const createApp = require("../app");

// describe("API /produtos testes de integracao", () => {
//     let app;

//     beforeEach(() => {
//         app = createApp();
//     });

//     describe("GET /produtos", () => {
//         test("retorna 200 e um array com os produtos iniciais", async () => {
//             const res = await request(app).get("/produtos");

//             expect(res.status).toBe(200);
//             expect(Array.isArray(res.body)).toBe(true);
//             expect(res.body.length).toBe(3);
//         });
//     });
// Criar caso de teste do GET /produtos/:id

//     describe("GET /produtos/:id", () => {
//         test("deve retornar 200 e o produto correto quando o ID for valido", async () => {
//             const res = await request(app).get("/produtos/1");

//             expect(res.status).toBe(200);
//             expect(res.body).toHaveProperty("id", 1);
//         });

//         test("deve retornar 404 quando o produto nao for encontrado", async () => {
//             const res = await request(app).get("/produtos/999");

//             expect(res.status).toBe(404);
//         });
//     });
// });
