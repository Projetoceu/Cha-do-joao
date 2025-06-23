const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

exports.handler = async function () {
  try {
    const { data, error } = await supabase
      .from('produtos')
      .select('id, nome, emoji, valor, cotas')
      .order('cotas', { ascending: true });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Erro interno' })
    };
  }
};
