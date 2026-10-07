// Exercicios
const ProdutoService = require("../services/ProdutoService");

describe("ProdutoService - Escrita", () => {
    let service;
    let mockRepository;

    beforeEach(() => {
        mockRepository = {
            create: jest.fn(),
            delete: jest.fn()
        };
        service = new ProdutoService(mockRepository); 
    });

    describe("criar", () => {
        test("deve repassar dados para mockRepository.create e retornar o produto criado", () => {
            const dados = { nome: "Teclado", preco: 150 };
            const produtoCriado = { id: 1, ...dados };
            
            mockRepository.create.mockReturnValue(produtoCriado);

            const resultado = service.criar(dados);

            expect(mockRepository.create).toHaveBeenCalledWith(dados);
            expect(resultado).toEqual(produtoCriado);
        });

        test("deve propagar o erro lancado pelo repository quando os dados forem invalidos", () => {
            const dadosInvalidos = { nome: "" };
            mockRepository.create.mockImplementation(() => {
                throw new Error("Dados inválidos");
            });

            expect(() => service.criar(dadosInvalidos)).toThrow("Dados inválidos");
        });
    });

    describe("remover", () => {
        test("deve chamar mockRepository.delete com o id correto quando o produto existe", () => {
            mockRepository.delete.mockReturnValue(true);

            expect(() => service.remover(1)).not.toThrow();
            expect(mockRepository.delete).toHaveBeenCalledWith(1);
        });

        test("deve lancar erro 'Produto nao encontrado' quando o repository retornar false", () => {
            mockRepository.delete.mockReturnValue(false);

            expect(() => service.remover(999)).toThrow("Produto nao encontrado");
            expect(mockRepository.delete).toHaveBeenCalledWith(999);
        });
    });
});


//Da aula com o professor 
// const ProdutoService = require("../services/ProdutoService");

// describe('ProdutoService - Testes Unitarias com Mocks', () => {
//     let service;
//     let mockRepository;

//     beforeEach(() => {
//         mockRepository = {
//             findAll: jest.fn(),
//             findByid: jest.fn(),
//             create:jest.fn(),
//             delete: jest.fn(), 
//         };
//         service = new ProdutoService(mockRepository);
//     });
// describe('Listar', () => {
//     test("Chama repository findAll uma vez e retorna o resultado", () => {
//         const produtos = [{id: 1, nome: "Coxinha", preco: 5}];
//         mockRepository.findAll.mockReturnValue(produtos);

//         const resultado = service.listar();

//         expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
//         expect(resultado).toEqual(produtos);
//     });
// });
// });
