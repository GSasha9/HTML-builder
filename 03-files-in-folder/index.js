const fs = require('fs/promises');
const path = require('path');

const directory = path.resolve('03-files-in-folder', 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(directory, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let data = '';
        data = file.name.split('.').join(' - ');
        const fpath = path.resolve(directory, file.name);
        const stat = await fs.stat(fpath);
        data += ` - ${(stat.size / 1024).toFixed(2)}kb`;
        console.log(data);
      } else {
        continue;
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
})();
