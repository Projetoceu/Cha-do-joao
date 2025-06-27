const { obterListaProdutos } = require('./lib/produtos');

// Retorna a lista de produtos a partir da planilha ou arquivo local
exports.handler = async () => {
  try {
    const data = await obterListaProdutos();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Erro ao obter produtos:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao ler dados.' }),
    };
  }
};
