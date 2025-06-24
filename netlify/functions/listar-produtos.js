const fs = require('fs');
const path = require('path');

// Retorna a lista de produtos do arquivo controle-de-produto.json
exports.handler = async () => {
  try {
    const file = path.resolve(__dirname, '..', '..', 'controle-de-produto.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error('Erro ao ler arquivo:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao ler dados.' }),
    };
  }
};
