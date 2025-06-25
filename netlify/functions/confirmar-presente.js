const fs = require('fs');
const path = require('path');
const { getWritablePath } = require('./lib/fileHelper');

const file = getWritablePath('controle-de-produto');
const mensagensFile = getWritablePath('mensagens.json');

function carregarProdutos() {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function salvarProdutos(lista) {
  fs.writeFileSync(file, JSON.stringify(lista, null, 2));
}

function carregarMensagens() {
  try {
    return JSON.parse(fs.readFileSync(mensagensFile, 'utf8'));
  } catch (err) {
    return [];
  }
}

function salvarMensagens(lista) {
  fs.writeFileSync(mensagensFile, JSON.stringify(lista, null, 2));
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
    const produtos = carregarProdutos();
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

    produto.cotas -= 1;
    salvarProdutos(produtos);

    const mensagens = carregarMensagens();
    mensagens.push({
      nome,
      mensagem,
      produto: produto.nome,
      valor: produto.valor,
      dataHora: new Date().toISOString()
    });
    salvarMensagens(mensagens);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, produto })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao confirmar' })
    };
  }
};
