const fs = require('fs').promises;
const { obterListaProdutos, salvarListaProdutos } = require('./lib/produtos');

async function carregarProdutos() {
  return await obterListaProdutos();
}

async function salvarProdutos(lista) {
  await salvarListaProdutos(lista);
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

    const produtos = await carregarProdutos();
    const produto = produtos.find(p => p.id === id);

    if (!produto) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Produto inválido' }) };
    }

    const novaCota = produto.cotas + quantidade;
    if (novaCota < 0) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Cotas insuficientes' }) };
    }

    produto.cotas = novaCota;
    await salvarProdutos(produtos);

    return { statusCode: 200, body: JSON.stringify({ sucesso: true, produto }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message || 'Erro ao atualizar' }) };
  }
};
