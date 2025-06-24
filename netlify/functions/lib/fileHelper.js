const fs = require('fs');
const path = require('path');

/**
 * Returns a writable path for a given filename.
 * If the default repo path is read-only (common in serverless environments),
 * the file is copied to /tmp on first use and that path is returned instead.
 */
function getWritablePath(filename) {
  // Resolve the file relative to the current working directory. When running
  // locally `process.cwd()` is the repository root. In the serverless runtime
  // it points to the unpacked function directory where the files are bundled.
  const repoPath = path.join(process.cwd(), filename);
  const tmpPath = path.join('/tmp', filename);

  try {
    fs.accessSync(repoPath, fs.constants.W_OK);
    return repoPath;
  } catch {
    if (!fs.existsSync(tmpPath)) {
      fs.copyFileSync(repoPath, tmpPath);
    }
    return tmpPath;
  }
}

module.exports = { getWritablePath };
