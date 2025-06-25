const fs = require('fs');
const path = require('path');
const { getWritablePath } = require('./lib/fileHelper');
const { corsHeaders } = require('./util');

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }
  try {
    const file = getWritablePath('controle-de-produto');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ sucesso: true, dados: data.slice(0, 1) }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ sucesso: false, erro: err.message }),
    };
  }
};
