// netlify/functions/listar-produtos.js
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async () => {
  const { data, error } = await supabase
    .from('produtos')
    .select('id, nome, valor, emoji, cotas');

  if (error) {
    console.error('Erro Supabase:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao consultar banco de dados.' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
