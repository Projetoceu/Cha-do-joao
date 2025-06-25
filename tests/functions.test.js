const fs = require('fs');
const path = require('path');
const listarProdutos = require('../netlify/functions/listar-produtos.js');
const confirmarPresente = require('../netlify/functions/confirmar-presente.js');
const listarMensagens = require('../netlify/functions/listar-mensagens.js');

const produtosFile = path.join(__dirname, '..', 'controle-de-produto');
const mensagensFile = path.join(__dirname, '..', 'mensagens.json');

let originalProdutos;
let originalMensagens;

beforeEach(() => {
  originalProdutos = fs.readFileSync(produtosFile, 'utf8');
  originalMensagens = fs.readFileSync(mensagensFile, 'utf8');
});

afterEach(() => {
  fs.writeFileSync(produtosFile, originalProdutos);
  fs.writeFileSync(mensagensFile, originalMensagens);
});

test('listar produtos', async () => {
  const resp = await listarProdutos.handler();
  expect(resp.statusCode).toBe(200);
  const data = JSON.parse(resp.body);
  expect(data).toEqual(JSON.parse(originalProdutos));
});

test('diminuir cotas ao finalizar compra', async () => {
  const produtos = JSON.parse(originalProdutos);
  const produto = produtos.find(p => p.cotas > 0);
  if (!produto) throw new Error('Nenhum produto com cotas disponíveis');
  const resp = await confirmarPresente.handler({
    httpMethod: 'POST',
    body: JSON.stringify({ id: produto.id, nome: 'Teste', mensagem: 'Ok' })
  });
  expect(resp.statusCode).toBe(200);
  const atualizados = JSON.parse(fs.readFileSync(produtosFile, 'utf8'));
  const atualizado = atualizados.find(p => p.id === produto.id);
  expect(atualizado.cotas).toBe(produto.cotas - 1);
});

test('capturar dados e enviar para area restrita', async () => {
  const produtos = JSON.parse(originalProdutos);
  const produto = produtos.find(p => p.cotas > 0);
  const nome = 'Visitante';
  const mensagem = 'Parabens!';

  await confirmarPresente.handler({
    httpMethod: 'POST',
    body: JSON.stringify({ id: produto.id, nome, mensagem })
  });

  const msgs = JSON.parse(fs.readFileSync(mensagensFile, 'utf8'));
  const ultima = msgs[msgs.length - 1];
  expect(ultima.nome).toBe(nome);
  expect(ultima.mensagem).toBe(mensagem);
  expect(ultima.produto).toBe(produto.nome);
  expect(ultima.valor).toBe(produto.valor);

  const resp = await listarMensagens.handler();
  const list = JSON.parse(resp.body);
  expect(list[list.length - 1]).toEqual(ultima);
});
