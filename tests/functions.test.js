const fs = require('fs');
const path = require('path');
const listarProdutos = require('../netlify/functions/listar-produtos.js');
const confirmarPresente = require('../netlify/functions/confirmar-presente.js');
const listarMensagens = require('../netlify/functions/listar-mensagens.js');
const { JSDOM } = require('jsdom');

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

test('dados aparecem na area restrita', async () => {
  const produtos = JSON.parse(originalProdutos);
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
  dom.window.setInterval = () => {};
  dom.window.prompt = jest.fn().mockReturnValue('08072010');
  dom.window.fetch = jest.fn((url, opts) => {
    if (url.includes('validar-senha')) {
      const body = JSON.parse(opts.body);
      return Promise.resolve({ ok: body.senha === '08072010' });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mensagens)
    });
  });

  await dom.window.solicitarSenha();
  await dom.window.carregarMensagens();

  const text = dom.window.document.getElementById('mensagens').textContent;
  const dataStr = new Date(ultima.dataHora).toLocaleString('pt-BR');
  expect(text).toContain(nome);
  expect(text).toContain(produto.nome);
  expect(text).toContain(produto.valor.toFixed(2).replace('.', ','));
  expect(text).toContain(mensagem);
  expect(text).toContain(dataStr);
});
