const fs = require('fs');
const path = require('path');
const { getWritablePath } = require('./lib/fileHelper');
const { corsHeaders } = require('./util');

const file = getWritablePath('mensagens.json');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }
  try {
    const data = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : [];
    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify(data) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Falha ao ler dados' }) };
  }
};
