const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

//create project-dist folder, create index.html in it and copy assets
const directory = path.resolve(__dirname, 'assets');
const destDirectory = path.resolve(__dirname, 'project-dist', 'assets');
const projectDist = path.resolve(__dirname, 'project-dist');

(async function copyDir() {
  try {
    await fsPromises.mkdir(projectDist, { recursive: true });
    await fsPromises.mkdir(destDirectory, { recursive: true });
    const destFiles = await fsPromises.readdir(destDirectory, {
      withFileTypes: true,
    });
    for (let file of destFiles) {
      await fsPromises.unlink(path.join(destDirectory, file.name));
    }
    async function copyFiles(directory, destDirectory) {
      const files = await fsPromises.readdir(directory, {
        withFileTypes: true,
      });
      for (let file of files) {
        if (file.isFile()) {
          const fPath = path.resolve(directory, file.name);
          const dPath = path.resolve(destDirectory, file.name);
          await fsPromises.copyFile(fPath, dPath);
        } else {
          const newDestDir = path.resolve(destDirectory, file.name);
          await fsPromises.mkdir(newDestDir, { recursive: true });
          await copyFiles(path.resolve(directory, file.name), newDestDir);
        }
      }
    }
    await copyFiles(directory, destDirectory);

    const template = await readFile(path.resolve(__dirname, 'template.html'));
    await fsPromises.writeFile(
      path.resolve(projectDist, 'index.html'),
      template,
      'utf-8',
    );
    replaceVarInTemplate();
  } catch (err) {
    console.error('Error reading directory:', err.message);
  }
})();

function readFile(file) {
  return fsPromises.readFile(file, 'utf-8');
}

//function to replace variables in index.html
async function replaceVarInTemplate() {
  try {
    const index = await readFile(path.resolve(projectDist, 'index.html'));
    const components = await fsPromises.readdir(
      path.resolve(__dirname, 'components'),
      { withFileTypes: true },
    );
    const tagValues = {};

    for (let file of components) {
      const componentName = file.name.split('.').shift();
      const componentContent = await fsPromises.readFile(
        path.resolve(__dirname, 'components', file.name),
        'utf-8',
      );
      tagValues[componentName] = componentContent;
    }
    const result = index.replace(/\{\{([^}]+)\}\}/g, (_, tag) => {
      return tagValues[tag.trim()] || '';
    });

    await fsPromises.writeFile(
      path.resolve(projectDist, 'index.html'),
      result,
      'utf-8',
    );
  } catch (err) {
    console.log(err.message);
  }
}



