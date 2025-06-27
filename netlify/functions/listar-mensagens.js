const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');
const API_URL = process.env.API_URL;

const file = getWritablePath('mensagens.json');

exports.handler = async () => {
  try {
    if (API_URL) {
      try {
        const resp = await fetch(`${API_URL}?lista=mensagens`);
        if (resp.ok) {
          const data = await resp.json();
          data.forEach(m => {
            if (m['data hora'] && !m.dataHora) {
              m.dataHora = m['data hora'];
              delete m['data hora'];
            }
          });
          return { statusCode: 200, body: JSON.stringify(data) };
        }
      } catch (err) {
        console.error('Erro ao consultar API:', err);
      }
    }
    let data = [];
    try {
      data = JSON.parse(await fs.readFile(file, 'utf8'));
    } catch {
      data = [];
    }
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falha ao ler dados' }) };
  }
};
