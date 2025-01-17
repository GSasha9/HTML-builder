const fs = require('fs/promises');
const path = require('path');

const directory = path.resolve(__dirname, 'files');
const destDirectory = path.resolve(__dirname, 'files-copy');

(async function copyDir() {
  try {
    await fs.mkdir(destDirectory, { recursive: true });
    const destFiles = await fs.readdir(destDirectory, { withFileTypes: true });
    for (let file of destFiles) {
      await fs.unlink(path.join(destDirectory, file.name));
    }
    const files = await fs.readdir(directory, { withFileTypes: true });
    for (let file of files) {
      if (file.isFile()) {
        const fPath = path.resolve(directory, file.name);
        const dPath = path.resolve(destDirectory, file.name);
        await fs.copyFile(fPath, dPath);
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
})();
