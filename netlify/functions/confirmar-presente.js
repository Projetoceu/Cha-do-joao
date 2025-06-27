const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');
const { obterListaProdutos, salvarListaProdutos } = require('./lib/produtos');
const API_URL = process.env.API_URL;

const mensagensFile = getWritablePath('mensagens.json');

async function carregarProdutos() {
  return await obterListaProdutos();
}

async function salvarProdutos(lista) {
  await salvarListaProdutos(lista);
}

async function carregarMensagens() {
  try {
    const data = await fs.readFile(mensagensFile, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function salvarMensagens(lista) {
  await fs.writeFile(mensagensFile, JSON.stringify(lista, null, 2));
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const { id, nome, mensagem } = JSON.parse(event.body);
    const produtos = await carregarProdutos();
    const produto = produtos.find(p => p.id === id);

    if (!produto || produto.cotas <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produto esgotado ou inválido' }),
      };
    }

    if (!nome || !mensagem) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados inválidos' }) };
    }

    // Garante que a cota nunca fique negativa
    produto.cotas = Math.max(produto.cotas - 1, 0);
    await salvarProdutos(produtos);

    const registro = {
      nome,
      mensagem,
      produto: produto.nome,
      valor: produto.valor,
      dataHora: new Date().toISOString(),
    };

    if (API_URL) {
      const envio = { ...registro };
      envio['data hora'] = envio.dataHora;
      delete envio.dataHora;
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envio)
      });
    } else {
      const mensagens = await carregarMensagens();
      mensagens.push(registro);
      await salvarMensagens(mensagens);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, produto, registro })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao confirmar' })
    };
  }
};
