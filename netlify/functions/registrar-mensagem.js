const fs = require('fs');
const path = require('path');
const { getWritablePath } = require('./lib/fileHelper');
const { corsHeaders } = require('./util');

const file = getWritablePath('mensagens.json');

function carregarMensagens() {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    return [];
  }
}

function salvarMensagens(lista) {
  fs.writeFileSync(file, JSON.stringify(lista, null, 2));
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { nome, mensagem, produto, valor } = JSON.parse(event.body);
    if (!nome || !mensagem || !produto || valor === undefined) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'Dados inválidos' }) };
    }

    const mensagens = carregarMensagens();
    mensagens.push({
      nome,
      mensagem,
      produto,
      valor,
      dataHora: new Date().toISOString()
    });
    salvarMensagens(mensagens);

    return { statusCode: 200, headers: corsHeaders, body: JSON.stringify({ sucesso: true }) };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
