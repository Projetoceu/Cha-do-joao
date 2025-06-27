# Chá do João

Este projeto contém a página do "Chá do João Victor" e algumas funções serverless
que consultam uma planilha para obter a lista de presentes. Nela ficam registrados
o nome, valor, emoji e a quantidade de cotas disponíveis de cada item.

## Requisitos

- [Node.js](https://nodejs.org/) 18 ou superior
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (opcional, mas
  necessário para executar as funções localmente)

```bash
npm install -g netlify-cli  # ou use `npx netlify dev`
```

## Executando o protótipo

1. Instale as dependências do projeto:

   ```bash
   npm install
   ```

2. Para testar a versão dinâmica com as funções serverless, execute:

   ```bash
   npm start
   ```

   Acesse `http://localhost:8888/index.html` no navegador.

3. Caso queira apenas visualizar o HTML estático, rode um servidor simples:

   ```bash
   npx http-server .
   ```

As funções obtêm os produtos diretamente de uma planilha no Google Sheets.
A URL do Apps Script que expõe esses dados já está configurada por padrão no
código das funções, portanto normalmente não é necessário definir `API_URL` em
ambientes de produção. Caso deseje trabalhar offline é possível gerar um arquivo
`controle-de-produto.json` executando `npm run importar-planilha`. Para
persistir mensagens e sincronizar a lista de presentes com a planilha, defina
duas variáveis de ambiente e, opcionalmente, indique a URL pública do CSV.
Quando `API_URL` estiver configurada as mensagens serão registradas
**exclusivamente** na aba **Mensagens** da planilha:

- `API_URL` com a URL do seu Apps Script (ex.: `https://script.google.com/.../exec`)
- `SENHA_RESTRITA` com a senha de acesso à área restrita.
- `SHEET_CSV_URL` com o link CSV publicado (ex.:
  `https://script.google.com/.../exec?lista=produtos&format=csv`).

Em ambientes de produção (ou ao rodar `netlify dev`) exporte essas variáveis.
Nos testes automatizados elas podem ser definidas temporariamente antes de
executar `npm test`.

## Importando produtos da planilha

Para atualizar `controle-de-produto.json` com os dados da planilha
publicada, execute:

```bash
node scripts/importar-planilha.js
```
