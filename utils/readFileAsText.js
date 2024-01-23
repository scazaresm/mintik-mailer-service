const fsPromises = require('fs').promises;

async function readFileAsText(filePath) {
  try {
    const data = await fsPromises.readFile(filePath, 'utf8');
    return data;
  } catch (err) {
    console.error(`Error reading file: ${err}`);
    return null;
  }
}

module.exports = readFileAsText;
