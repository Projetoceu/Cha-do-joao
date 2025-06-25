const fs = require('fs');
const path = require('path');
const { getWritablePath } = require('./lib/fileHelper');

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
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { nome, mensagem, produto, valor } = JSON.parse(event.body);
    if (!nome || !mensagem || !produto || valor === undefined) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Dados inválidos' }) };
    }

    const mensagens = carregarMensagens();
    const registro = {
      nome,
      mensagem,
      produto,
      valor,
      dataHora: new Date().toISOString(),
    };
    mensagens.push(registro);
    salvarMensagens(mensagens);

    return { statusCode: 200, body: JSON.stringify({ sucesso: true, registro }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
