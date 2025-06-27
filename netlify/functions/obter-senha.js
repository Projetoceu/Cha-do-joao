exports.handler = async () => {
  const senha = process.env.SENHA_RESTRITA || '';
  return {
    statusCode: 200,
    body: senha
  };
};
