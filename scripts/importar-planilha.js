const fs = require('fs');
const path = require('path');

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTW2DepGwyOvo4OwnBjdMmVffq_m532i4XielrA_Rs0L1LSNOqO4XLS4AUYKQIPD_O9nskYJ-HpKgeV/pub?output=csv';

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(',');
  return lines.map(line => {
    const cols = line.split(',');
    const obj = {};
    headers.forEach((h, i) => {
      let v = cols[i];
      if (["id", "valor", "cotas"].includes(h)) v = Number(v);
      obj[h] = v;
    });
    return obj;
  });
}

async function main() {
  const resp = await fetch(CSV_URL);
  if (!resp.ok) throw new Error(`Erro ao baixar CSV: ${resp.status}`);
  const csv = await resp.text();
  const produtos = parseCsv(csv);
  const file = path.join(__dirname, '..', 'controle-de-produto.json');
  fs.writeFileSync(file, JSON.stringify(produtos, null, 2));
  console.log(`Arquivo ${file} atualizado com ${produtos.length} produtos.`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
