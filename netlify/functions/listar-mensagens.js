const fs = require('fs');
const path = require('path');

const file = path.resolve(__dirname, '..', '..', 'mensagens.json');

exports.handler = async () => {
  try {
    const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Falha ao ler dados' }) };
  }
};
