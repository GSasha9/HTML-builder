const fs = require('fs');
const path = require('path');

function readTemplate() {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(
      path.resolve(__dirname, 'template.html'),
      'utf-8',
    );
    let content = '';
    readStream.on('data', (chunk) => {
      content += chunk;
    });

    readStream.on('end', () => {
      resolve(content);
    });

    readStream.on('error', () => {
      reject(error.message);
    });
  });
}

(async function replaceVarInTemplate() {
  try {
    const template = await readTemplate();
    const components = await fs.promises.readdir(
      path.resolve(__dirname, 'components'),
      { withFileTypes: true },
    );
    const tagValues = {};

    for (let file of components) {
      const componentName = file.name.split('.').shift();
      const componentContent = await fs.promises.readFile(
        path.resolve(file.path, file.name),
        'utf-8',
      );
      tagValues[componentName] = componentContent;
    }
    const result = template.replace(
      /\{\{([^}]+)\}\}/g,
      ((_,
      tag) => {
        return tagValues[tag.trim()] || '';
      }),
    );

    await fs.promises.writeFile(
      path.resolve(__dirname, 'template.html'),
      result,
      'utf-8',
    );
  } catch (err) {
    console.log(err.message);
  }
})();
