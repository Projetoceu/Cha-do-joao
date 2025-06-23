const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

exports.handler = async (event) => {
  const { id } = JSON.parse(event.body);
  const { data, error } = await supabase
    .from('produtos')
    .select('cotas')
    .eq('id', id)
    .single();
  
  if (error || data.cotas <= 0) {
    return { statusCode: 400, body: JSON.stringify({ erro: 'Cotas esgotadas' }) };
  }

  const { error: updateError } = await supabase
    .from('produtos')
    .update({ cotas: data.cotas - 1 })
    .eq('id', id);

  if (updateError) return { statusCode: 500, body: JSON.stringify(updateError) };

  return { statusCode: 200, body: JSON.stringify({ sucesso: true }) };
};
