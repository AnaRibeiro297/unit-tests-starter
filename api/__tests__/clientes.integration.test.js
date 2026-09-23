const request = require('supertest');
const createApp = require('../app');

// Teste de integracao: testa a API de ponta a ponta via HTTP real.
// Cada teste recebe uma app nova (factory), garantindo estado isolado.
//
// Abaixo ha 1 teste pronto (GET /clientes) como referencia de estilo.
// Os demais estao como test.todo — implemente cada um seguindo o ENUNCIADO-02-CLIENTES.md.

//Enunciados
describe('API /clientes (integracao com supertest)', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  describe('GET /clientes', () => {
    test('retorna 200 e um array com os clientes iniciais', async () => {
      const res = await request(app).get('/clientes');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(2);
    });
  });

  describe('GET /clientes/:id', () => {
    test('retorna 200 e o cliente quando o id existe', async () => {
      const res = await request(app).get('/clientes/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('nome');
      expect(res.body).toHaveProperty('email');
    });

    test('retorna 404 com mensagem de erro quando o cliente nao existe', async () => {
      const res = await request(app).get('/clientes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('POST /clientes', () => {
    test('retorna 201 e o cliente criado com id gerado', async () => {
      const novoCliente = {
        nome: 'Carlos Eduardo',
        email: 'carlos@email.com'
      };

      const res = await request(app).post('/clientes').send(novoCliente);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.nome).toBe(novoCliente.nome);
      expect(res.body.email).toBe(novoCliente.email);
    });

    test('retorna 400 quando o nome esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({ email: 'semnome@email.com' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando o email esta faltando', async () => {
      const res = await request(app)
        .post('/clientes')
        .send({ nome: 'Sem Email' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando o email ja esta cadastrado', async () => {
      const clienteExistente = await request(app).get('/clientes/1');
      const emailExistente = clienteExistente.body.email;

      const res = await request(app)
        .post('/clientes')
        .send({
          nome: 'Cliente Duplicado',
          email: emailExistente
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });

    test('cliente criado aparece em GET /clientes', async () => {
      const novoCliente = {
        nome: 'Fernanda Lima',
        email: 'fernanda@email.com'
      };

      const postRes = await request(app).post('/clientes').send(novoCliente);
      const clienteCriado = postRes.body;

      const getRes = await request(app).get('/clientes');

      expect(getRes.status).toBe(200);
      expect(getRes.body).toContainEqual(clienteCriado);
    });
  });

  describe('PUT /clientes/:id', () => {
    test('retorna 200 e o cliente atualizado quando o id existe', async () => {
      const dadosAtualizados = {
        nome: 'Nome Atualizado',
        email: 'novoemail@email.com'
      };

      const res = await request(app).put('/clientes/1').send(dadosAtualizados);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body.nome).toBe(dadosAtualizados.nome);
      expect(res.body.email).toBe(dadosAtualizados.email);
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app)
        .put('/clientes/999')
        .send({ nome: 'Inexistente', email: 'inexistente@email.com' });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 400 quando o novo email ja pertence a outro cliente', async () => {
      const cliente2 = await request(app).get('/clientes/2');
      const emailCliente2 = cliente2.body.email;

      const res = await request(app)
        .put('/clientes/1')
        .send({ nome: 'Cliente 1', email: emailCliente2 });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('erro');
    });
  });

  describe('DELETE /clientes/:id', () => {
    test('retorna 204 quando o cliente e removido com sucesso', async () => {
      const res = await request(app).delete('/clientes/1');

      expect(res.status).toBe(204);
    });

    test('cliente removido nao aparece mais na listagem', async () => {
      await request(app).delete('/clientes/1');

      const res = await request(app).get('/clientes/1');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });

    test('retorna 404 quando o cliente nao existe', async () => {
      const res = await request(app).delete('/clientes/999');

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('erro');
    });
  });
});


// describe('API /clientes (integracao com supertest)', () => {
//   let app;

//   beforeEach(() => {
//     app = createApp();
//   });

//   describe('GET /clientes', () => {
//     test('retorna 200 e um array com os clientes iniciais', async () => {
//       const res = await request(app).get('/clientes');

//       expect(res.status).toBe(200);
//       expect(Array.isArray(res.body)).toBe(true);
//       expect(res.body.length).toBe(2);
//     });
//   });

//   describe('GET /clientes/:id', () => {
//     test.todo('retorna 200 e o cliente quando o id existe');
//     test.todo('retorna 404 com mensagem de erro quando o cliente nao existe');
//   });

//   describe('POST /clientes', () => {
//     test.todo('retorna 201 e o cliente criado com id gerado');
//     test.todo('retorna 400 quando o nome esta faltando');
//     test.todo('retorna 400 quando o email esta faltando');
//     test.todo('retorna 400 quando o email ja esta cadastrado');
//     test.todo('cliente criado aparece em GET /clientes');
//   });

//   describe('PUT /clientes/:id', () => {
//     test.todo('retorna 200 e o cliente atualizado quando o id existe');
//     test.todo('retorna 404 quando o cliente nao existe');
//     test.todo('retorna 400 quando o novo email ja pertence a outro cliente');
//   });

//   describe('DELETE /clientes/:id', () => {
//     test.todo('retorna 204 quando o cliente e removido com sucesso');
//     test.todo('cliente removido nao aparece mais na listagem');
//     test.todo('retorna 404 quando o cliente nao existe');
//   });
// });
