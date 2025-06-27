# Chá do João

Este projeto contém a página do "Chá do João Victor" e algumas funções serverless
que manipulam um arquivo `controle-de-produto.json`. Nesse arquivo ficam
registrados o nome, valor, emoji e a quantidade de cotas disponíveis de cada
presente.

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

   Acesse `http://localhost:8888/indexV2.html` no navegador.

3. Caso queira apenas visualizar o HTML estático, rode um servidor simples:

   ```bash
   npx http-server .
   ```

O arquivo `controle-de-produto.json` acompanha este repositório e é usado
pelas funções para ler e atualizar as cotas conforme os presentes são
confirmados. Também é possível integrar a aplicação com a planilha
compartilhada no Google Sheets. Para habilitar essa integração defina as
seguintes variáveis de ambiente:

- `API_URL` com a URL do seu Apps Script (ex.: `https://script.google.com/.../exec`)
- `SENHA_RESTRITA` com a senha de acesso à área restrita.

Em ambientes de produção (ou ao rodar `netlify dev`) exporte essas variáveis.
Nos testes automatizados elas podem ser definidas temporariamente antes de
executar `npm test`.

### Estrutura da planilha

A planilha precisa de duas abas:

1. **Produtos** com as colunas `id`, `produto`, `valor` e `cotas`.
2. **Mensagens** com as colunas `nome`, `produto`, `valor`, `mensagem` e `dataHora`.

Crie um projeto em **Extensões → Apps Script**, cole o código de exemplo e
implante-o como "Aplicativo da Web". A URL gerada deve ser informada em
`API_URL`.
