const correct = process.env.SENHA_RESTRITA || '08072010';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { senha } = JSON.parse(event.body || '{}');
    if (senha === correct) {
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }
    return { statusCode: 401, body: JSON.stringify({ error: 'Senha incorreta' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Erro ao validar' }) };
  }
};

