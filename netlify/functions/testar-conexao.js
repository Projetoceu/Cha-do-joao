const fs = require('fs');
const path = require('path');
const { resolveDataPath } = require('./util');

exports.handler = async () => {
  try {
    const data = JSON.parse(
      fs.readFileSync(resolveDataPath('controle-de-produto'), 'utf8')
    );
    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true, dados: data.slice(0, 1) }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ sucesso: false, erro: err.message }),
    };
  }
};
