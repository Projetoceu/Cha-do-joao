const { obterListaProdutos } = require('./lib/produtos');

exports.handler = async () => {
  try {
    const data = await obterListaProdutos();
    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, dados: data.slice(0, 1) }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ sucesso: false, erro: err.message }),
    };
  }
};
