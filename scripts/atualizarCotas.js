const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase
    .from('produtos')
    .select('id, cotas');

  if (error) {
    console.error('Erro ao consultar Supabase:', error);
    process.exit(1);
  }

  const filePath = path.resolve(__dirname, '..', 'cotas.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('Arquivo salvo em', filePath);
}

main();
