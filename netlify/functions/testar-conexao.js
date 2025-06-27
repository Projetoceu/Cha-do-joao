const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');

exports.handler = async () => {
  try {
    const file = getWritablePath('controle-de-produto.json');
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
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
