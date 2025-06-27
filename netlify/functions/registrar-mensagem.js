const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');
const API_URL = process.env.API_URL;

const file = getWritablePath('mensagens.json');

async function carregarMensagens() {
  try {
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function salvarMensagens(lista) {
  await fs.writeFile(file, JSON.stringify(lista, null, 2));
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

    const mensagens = await carregarMensagens();
    const registro = {
      nome,
      mensagem,
      produto,
      valor,
      dataHora: new Date().toISOString(),
    };
    mensagens.push(registro);
    await salvarMensagens(mensagens);
    if (API_URL) {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registro)
      }).catch(() => {});
    }

    return { statusCode: 200, body: JSON.stringify({ sucesso: true, registro }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
