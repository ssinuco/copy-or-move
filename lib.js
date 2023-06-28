//check if path exists
const fs = require('fs');
const path = require('path');

const getSourcePathType = (source) => {
  // return promise
  return new Promise((resolve, reject) => {
    // check if source is a file or directory
    fs.stat(source, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (!stats) {
        return reject(new Error(`No such file or directory ${source}`));
      }
      return resolve(stats.isFile() ? 'file' : 'folder');
    });
  });
};

const getDestinationType = (destination) => {
  return new Promise((resolve, reject) => {
    fs.stat(destination, (err, stats) => {
      if (err && err.code !== 'ENOENT') {
        return reject(err);
      }
      if (!stats) {
        //validate if parent folder exists
        const parentFolder = path.dirname(destination);
        if (fs.existsSync(parentFolder)) {
          return resolve('file');
        }
        else {
          return reject(new Error(`No such file or directory ${destination}`));
        }
      }
      return resolve(stats.isFile() ? 'file' : 'folder');
    });
  });
};

// get files from directory recursively
const getFilesFromDirectory = (source) => {
  let result = [];
  const files = fs.readdirSync(source);
  files.forEach(file => {
    const newFile = path.join(source, file);
    if (fs.statSync(newFile).isFile()) {
      result.push(newFile);
    }
    else {
      result = result.concat(getFilesFromDirectory(newFile));
    }
  });
  return result;
};

//create directory
const createDirectory = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dirname, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

// copy file
const executeOperation = (file, newFile, operation) => {
  const dirname = path.dirname(newFile);

  return new Promise((resolve, reject) => {
    createDirectory(dirname)
      .finally(() => { //finally is called even if createDirectory fails
        operation(file, newFile, (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      });
  });
};

const doOperation = (source, destination, operation) => {
  // check if source and destination exist
  return Promise.all(
    [
      getSourcePathType(source),
      getDestinationType(destination),
    ]
  )
    .then(([sourceType, destinationType]) => {
      let sourceFolder = null;
      let filesFromSource = [];
      let destinationFolder = null;
      let destinationFileName = null;
      if (sourceType === 'file') {
        sourceFolder = path.dirname(source);
        filesFromSource.push(source);
        if (destinationType === 'folder') {
          destinationFolder = destination;
          destinationFileName = path.basename(source);
        }
        else {
          destinationFolder = path.dirname(destination);
          destinationFileName = path.basename(destination);
        }
      }
      else {
        sourceFolder = source;
        filesFromSource = getFilesFromDirectory(source);
        destinationFolder = destination;
      }
      return Promise.all(filesFromSource.map(file => {
        const newPath = path.join(destinationFolder, path.dirname(path.relative(sourceFolder, file)));
        const newFileName = destinationFileName ?? path.basename(file);
        return executeOperation(file, path.join(newPath, newFileName), operation);
      }));
    });
};

const copy = (source, destination) => {
  return doOperation(source, destination, fs.copyFile);
}

const move = (source, destination) => {
  return doOperation(source, destination, fs.rename);
};

//export
module.exports = {
  copy,
  move,
};