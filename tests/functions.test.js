const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const produtosFile = path.join(__dirname, '..', 'controle-de-produto.json');
const mensagensFile = path.join(__dirname, '..', 'mensagens.json');

let listarProdutos;
let confirmarPresente;
let listarMensagens;

const sampleProdutos = [
  { id: 0, nome: 'Produto A', emoji: '🅰️', valor: 10, cotas: 1 },
  { id: 1, nome: 'Produto B', emoji: '🅱️', valor: 20, cotas: 0 },
  { id: 2, nome: 'Produto C', emoji: '🆑', valor: 30, cotas: 3 }
];

beforeEach(() => {
  fs.writeFileSync(produtosFile, JSON.stringify(sampleProdutos, null, 2));
  fs.writeFileSync(mensagensFile, '[]');
  jest.resetModules();
  listarProdutos = require('../netlify/functions/listar-produtos.js');
  confirmarPresente = require('../netlify/functions/confirmar-presente.js');
  listarMensagens = require('../netlify/functions/listar-mensagens.js');
});

afterEach(() => {
  fs.unlinkSync(produtosFile);
  fs.unlinkSync(mensagensFile);
  jest.resetModules();
});

test('listar produtos', async () => {
  const resp = await listarProdutos.handler();
  expect(resp.statusCode).toBe(200);
  const data = JSON.parse(resp.body);
  expect(data).toEqual(sampleProdutos);
});

test('diminuir cotas ao finalizar compra', async () => {
  const produtos = sampleProdutos;
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
  const produtos = sampleProdutos;
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

test('dados aparecem na area restrita', async () => {
  const produtos = sampleProdutos;
  const produto = produtos.find(p => p.cotas > 0);
  const nome = 'Visitante Area';
  const mensagem = 'Tudo certo';

  await confirmarPresente.handler({
    httpMethod: 'POST',
    body: JSON.stringify({ id: produto.id, nome, mensagem })
  });

  const listResp = await listarMensagens.handler();
  const mensagens = JSON.parse(listResp.body);
  const ultima = mensagens[mensagens.length - 1];

  const html = fs.readFileSync(path.join(__dirname, '..', 'area-restrita.html'), 'utf8');
  const dom = new JSDOM(html, { runScripts: 'dangerously' });
  dom.window.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(mensagens)
  });
  dom.window.setInterval = () => {};
  await dom.window.carregarMensagens();
  const text = dom.window.document.getElementById('mensagens').textContent;
  const dataStr = new Date(ultima.dataHora).toLocaleString('pt-BR');
  expect(text).toContain(nome);
  expect(text).toContain(produto.nome);
  expect(text).toContain(produto.valor.toFixed(2).replace('.', ','));
  expect(text).toContain(mensagem);
  expect(text).toContain(dataStr);
});
