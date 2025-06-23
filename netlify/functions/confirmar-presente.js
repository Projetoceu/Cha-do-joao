const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Método não permitido' }),
    };
  }

  try {
    const { id } = JSON.parse(event.body);

    // Pega o produto atual
    const { data: produto, error: erroBusca } = await supabase
      .from('produtos')
      .select('cotas')
      .eq('id', id)
      .single();

    if (erroBusca) throw erroBusca;

    if (!produto || produto.cotas <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Produto esgotado ou inválido' }),
      };
    }

    // Atualiza a cota (diminui 1)
    const { error: erroUpdate } = await supabase
      .from('produtos')
      .update({ cotas: produto.cotas - 1 })
      .eq('id', id);

    if (erroUpdate) throw erroUpdate;

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro ao confirmar' })
    };
  }
};
