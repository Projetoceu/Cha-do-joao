const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', '..', 'controle-de-produto');

function carregarProdutos() {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function salvarProdutos(lista) {
  fs.writeFileSync(file, JSON.stringify(lista, null, 2));
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const { id } = JSON.parse(event.body);
    const produtos = carregarProdutos();
    const produto = produtos.find(p => p.id === id);

    if (!produto || produto.cotas <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produto esgotado ou inválido' }),
      };
    }

    produto.cotas -= 1;
    salvarProdutos(produtos);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao confirmar' })
    };
  }
};
