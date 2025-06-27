const fs = require('fs').promises;
const { getWritablePath } = require('./fileHelper');
const DEFAULT_API_URL = 'https://script.google.com/macros/s/AKfycbz8OauQcUyVChVwJ70tgWx8ZmXh1HPO3qe9MUv8s_EeBVaq0L569bPsOVzuZMjbti5yeA/exec';
const API_URL = process.env.NODE_ENV === 'test'
  ? process.env.API_URL
  : (process.env.API_URL || DEFAULT_API_URL);
const SHEET_CSV_URL = process.env.SHEET_CSV_URL ||
  'https://script.google.com/macros/s/AKfycbz8OauQcUyVChVwJ70tgWx8ZmXh1HPO3qe9MUv8s_EeBVaq0L569bPsOVzuZMjbti5yeA/exec?lista=produtos&format=csv';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      let v = cols[i];
      if (['id', 'valor', 'cotas'].includes(h)) v = Number(v);
      obj[h] = v;
    });
    return obj;
  });
}

async function carregarDaPlanilha() {
  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(SHEET_CSV_URL, { signal: controller.signal });
    clearTimeout(t);
    if (resp.ok) {
      const texto = await resp.text();
      return parseCsv(texto);
    }
  } catch (err) {
    console.error('Erro ao consultar planilha:', err);
  }
  return null;
}

async function obterListaProdutos() {
  if (API_URL) {
    try {
      const resp = await fetch(`${API_URL}?lista=produtos`);
      if (resp.ok) {
        return await resp.json();
      }
    } catch (err) {
      console.error('Erro ao consultar API:', err);
    }
  }

  const sheet = await carregarDaPlanilha();
  if (sheet && sheet.length) {
    return sheet;
  }

  const file = getWritablePath('controle-de-produto.json');
  try {
    await fs.access(file);
    const data = await fs.readFile(file, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function salvarListaProdutos(lista) {
  if (API_URL && process.env.NODE_ENV !== 'test') {
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtos: lista })
      });
      return;
    } catch (err) {
      console.error('Erro ao salvar via API:', err);
    }
  }
  const file = getWritablePath('controle-de-produto.json');
  await fs.writeFile(file, JSON.stringify(lista, null, 2));
}

module.exports = {
  obterListaProdutos,
  salvarListaProdutos,
};
