const fs = require('fs');
const path = require('path');

const produtosPath = path.join(__dirname, '..', 'controle-de-produto.json');
const csvPath = path.join(__dirname, '..', 'produtos.csv');

const produtos = JSON.parse(fs.readFileSync(produtosPath, 'utf8'));

const header = ['id', 'nome', 'emoji', 'valor', 'cotas'];
const linhas = produtos.map(p => [p.id, p.nome, p.emoji, p.valor, p.cotas]);

const esc = v => `"${String(v).replace(/"/g, '""')}"`;
const csv = [header.join(','), ...linhas.map(l => l.map(esc).join(','))].join('\n');

fs.writeFileSync(csvPath, csv + '\n');
console.log(`Arquivo ${csvPath} gerado com ${linhas.length} produtos.`);
