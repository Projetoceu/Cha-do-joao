const { createClient } = require('@supabase/supabase-js');

// Use variáveis de ambiente com os nomes corretos definidos no Netlify
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' })
    };
  }

  try {
    const { id } = JSON.parse(event.body);

    // Busca produto
    const { data: produto, error: erroBusca } = await supabase
      .from('produtos')
      .select('cotas')
      .eq('id', id)
      .single();

    if (erroBusca) throw erroBusca;

    if (!produto || produto.cotas <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produto esgotado ou inválido' })
      };
    }

    // Atualiza cotas
    const { error: erroAtualiza } = await supabase
      .from('produtos')
      .update({ cotas: produto.cotas - 1 })
      .eq('id', id);

    if (erroAtualiza) throw erroAtualiza;

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao processar' })
    };
  }
};
