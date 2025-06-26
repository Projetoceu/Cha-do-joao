const fs = require('fs');
const { getWritablePath } = require('./lib/fileHelper');

const file = getWritablePath('controle-de-produto.json');

function carregarProdutos() {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function salvarProdutos(lista) {
  fs.writeFileSync(file, JSON.stringify(lista, null, 2));
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { id, quantidade } = JSON.parse(event.body);
    if (typeof id !== 'number' || typeof quantidade !== 'number') {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados inválidos' }) };
    }

    const produtos = carregarProdutos();
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Produto inválido' }) };
    }

    const novaCota = produto.cotas + quantidade;
    if (novaCota < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Cotas insuficientes' }) };
    }

    produto.cotas = novaCota;
    salvarProdutos(produtos);

    return { statusCode: 200, body: JSON.stringify({ sucesso: true, produto }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Erro ao atualizar' }) };
  }
};
