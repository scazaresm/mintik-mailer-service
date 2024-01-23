
const fs = require('fs');
const fsPromises = fs.promises;

async function fileExists(path) {
  try {
    await fsPromises.access(path, fs.constants.F_OK);
    return true;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return false; // File does not exist
    } else {
      throw error; // Other errors (e.g., permission issues)
    }
  }
};

module.exports = fileExists;
