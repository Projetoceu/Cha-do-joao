const fs = require('fs');
const path = require('path');
const atualizarCota = require('../netlify/functions/atualizar-cota.js');

const produtosFile = path.join(__dirname, '..', 'controle-de-produto');

let originalProdutos;

beforeEach(() => {
  originalProdutos = fs.readFileSync(produtosFile, 'utf8');
});

afterEach(() => {
  fs.writeFileSync(produtosFile, originalProdutos);
});

test('atualizar cotas de um produto', async () => {
  const produtos = JSON.parse(originalProdutos);
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
