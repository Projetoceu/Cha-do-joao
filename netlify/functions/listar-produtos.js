const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');
const API_URL = process.env.API_URL;

// Retorna a lista de produtos do arquivo controle-de-produto.json
exports.handler = async () => {
  try {
    if (API_URL) {
      try {
        const resp = await fetch(`${API_URL}?lista=produtos`);
        if (resp.ok) {
          const data = await resp.json();
          return { statusCode: 200, body: JSON.stringify(data) };
        }
      } catch (err) {
        console.error('Erro ao consultar API:', err);
      }
    }
    const file = getWritablePath('controle-de-produto.json');
    const data = JSON.parse(await fs.readFile(file, 'utf8'));
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    console.error('Erro ao ler arquivo:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Falha ao ler dados.' }),
    };
  }
};
