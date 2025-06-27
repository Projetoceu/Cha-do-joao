const fs = require('fs').promises;
const { getWritablePath } = require('./lib/fileHelper');
const API_URL = process.env.API_URL;
const SHEET_CSV_URL = process.env.SHEET_CSV_URL ||
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vTW2DepGwyOvo4OwnBjdMmVffq_m532i4XielrA_Rs0L1LSNOqO4XLS4AUYKQIPD_O9nskYJ-HpKgeV/pub?output=csv';

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

    const sheet = await carregarDaPlanilha();
    if (sheet && sheet.length) {
      return { statusCode: 200, body: JSON.stringify(sheet) };
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
