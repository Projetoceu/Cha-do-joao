const fs = require('fs');
const path = require('path');

function resolveDataPath(name) {
  const rootPath = path.resolve(__dirname, '..', '..', name);
  try {
    fs.accessSync(rootPath, fs.constants.W_OK);
    return rootPath;
  } catch (_) {
    const tmpPath = path.join('/tmp', name);
    if (!fs.existsSync(tmpPath)) {
      if (fs.existsSync(rootPath)) {
        fs.copyFileSync(rootPath, tmpPath);
      } else {
        fs.writeFileSync(tmpPath, '[]');
      }
    }
    return tmpPath;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

module.exports = { resolveDataPath, corsHeaders };
