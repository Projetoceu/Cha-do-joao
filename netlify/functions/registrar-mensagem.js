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

    const brDate = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
      .replace(' ', 'T') + '-03:00';
    const registro = {
      nome,
      mensagem,
      produto,
      valor,
      dataHora: brDate,
    };

    if (API_URL) {
      const envio = { ...registro };
      envio['data hora'] = envio.dataHora;
      delete envio.dataHora;
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(envio)
      });
    } else {
      const mensagens = await carregarMensagens();
      mensagens.push(registro);
      await salvarMensagens(mensagens);
    }

    return { statusCode: 200, body: JSON.stringify({ sucesso: true, registro }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
