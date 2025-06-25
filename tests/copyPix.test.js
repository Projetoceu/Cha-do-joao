const { JSDOM } = require('jsdom');

jest.useFakeTimers();

test('copiar a chave pix ao clicar em copiar', async () => {
  const dom = new JSDOM(`<button id="btn">Copiar</button>`);
  global.navigator = {
    clipboard: { writeText: jest.fn().mockResolvedValue() }
  };
  global.alert = jest.fn();

  function copiarChavePix(btn) {
    navigator.clipboard.writeText("06575533957")
      .then(() => {
        btn.textContent = 'COPIADO!';
        setTimeout(() => btn.textContent = 'Copiar', 15000);
      })
      .catch(err => alert('Erro ao copiar a chave Pix'));
  }

  const btn = dom.window.document.getElementById('btn');
  copiarChavePix(btn);
  await Promise.resolve();
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith("06575533957");
  expect(btn.textContent).toBe('COPIADO!');

  jest.advanceTimersByTime(15000);
  await Promise.resolve();
  expect(btn.textContent).toBe('Copiar');
});
