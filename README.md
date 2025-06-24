# Chá do João

Este projeto contém a página do "Chá do João Victor" e algumas funções serverless
utilizadas para consultar o banco de dados no Supabase.

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

2. Defina as variáveis de ambiente `SUPABASE_URL` e `SUPABASE_ANON_KEY`. Você
   pode criar um arquivo `.env` (que já está ignorado pelo Git) ou definir as
   variáveis no ambiente do Netlify.

3. Para testar a versão dinâmica com as funções serverless, execute:

   ```bash
   netlify dev
   ```

   Acesse `http://localhost:8888/indexV2.html` no navegador.

4. Caso queira apenas visualizar o HTML estático, rode um servidor simples:

   ```bash
   npx http-server .
   ```

   A lista de presentes em `indexV2.html` usará um conjunto de dados de
   exemplo se a API não estiver disponível.
