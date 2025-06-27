const fs = require('fs');
const path = require('path');
let atualizarCota;

const produtosFile = path.join(__dirname, '..', 'controle-de-produto.json');

const sampleProdutos = [
  { id: 0, nome: 'Produto A', emoji: '🅰️', valor: 10, cotas: 1 },
  { id: 1, nome: 'Produto B', emoji: '🅱️', valor: 20, cotas: 0 },
  { id: 2, nome: 'Produto C', emoji: '🆑', valor: 30, cotas: 3 }
];

beforeEach(() => {
  fs.writeFileSync(produtosFile, JSON.stringify(sampleProdutos, null, 2));
  jest.resetModules();
  atualizarCota = require('../netlify/functions/atualizar-cota.js');
});

afterEach(() => {
  fs.unlinkSync(produtosFile);
  jest.resetModules();
});

test('atualizar cotas de um produto', async () => {
  const produtos = sampleProdutos;
  const produto = produtos[0];
  const resp = await atualizarCota.handler({
    httpMethod: 'POST',
    body: JSON.stringify({ id: produto.id, quantidade: 2 })
  });
  expect(resp.statusCode).toBe(200);
  const atualizados = JSON.parse(fs.readFileSync(produtosFile, 'utf8'));
  const atualizado = atualizados.find(p => p.id === produto.id);
  expect(atualizado.cotas).toBe(produto.cotas + 2);
});
