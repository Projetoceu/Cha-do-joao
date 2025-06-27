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
    const { id } = JSON.parse(event.body);
    const produtos = await carregarProdutos();
    const produto = produtos.find(p => p.id === id);

    if (!produto || produto.cotas <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produto esgotado ou inválido' })
      };
    }

    // Evita valores negativos de cota
    produto.cotas = Math.max(produto.cotas - 1, 0);
    await salvarProdutos(produtos);

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao processar' })
    };
  }
};
