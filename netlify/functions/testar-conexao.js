const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://niqphubutahhnrliyikl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pcXBodWJ1dGFoaG5ybGl5aWtsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MDQ1NjgsImV4cCI6MjA2NjI4MDU2OH0.p4Pg0sEjmL_othOhYbrjW56SQBQCIkXWKlkzlQGDpeg'
);

exports.handler = async () => {
  const { data, error } = await supabase.from('produtos').select('*').limit(1);
  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ sucesso: false, erro: error.message }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ sucesso: true, dados: data }),
  };
};
