const fs = require('fs');
const path = require('path');

const sourceDirectory = path.resolve(__dirname, 'styles');
const destDirectory = path.resolve(__dirname, 'project-dist');
const destFile = path.resolve(destDirectory, 'bundle.css');
const writeStream = fs.createWriteStream(destFile, 'utf-8');

(async function compiler() {
  try {
    const sourseStyles = await fs.promises.readdir(sourceDirectory, {
      withFileTypes: true,
    });
    for (let file of sourseStyles) {
      if (file.isFile()) {
        if (file.name.split('.').pop() === 'css') {
          const readStream = fs.createReadStream(
            path.resolve(sourceDirectory, file.name), "utf-8"
          );
          readStream.pipe(writeStream, { end: false });
        }
      }
    }
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
})();
