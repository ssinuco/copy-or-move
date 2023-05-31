const { copy, move, getFilesFromDirectory } = require('../lib.js');
const fs = require('fs');
const path = require('path');


const SOURCE_FOLDER = path.join(__dirname, './source');
const DESTINATION_FOLDER = path.join(__dirname, './destination');

function deleteTestFolders() {
  fs.rmSync(SOURCE_FOLDER, { recursive: true, force: true });
  fs.rmSync(DESTINATION_FOLDER, { recursive: true, force: true });
}

function createTestFolders() {
  fs.mkdirSync(SOURCE_FOLDER);
  fs.writeFileSync(`${SOURCE_FOLDER}/test.txt`, '');
  fs.mkdirSync(`${SOURCE_FOLDER}/subfolder`);
  fs.writeFileSync(`${SOURCE_FOLDER}/subfolder/newtest.txt`, '');
  fs.mkdirSync(DESTINATION_FOLDER);
}

describe('copy', () => {

  beforeEach(() => {
    deleteTestFolders();
    createTestFolders();
  });

  afterEach(() => {
    deleteTestFolders();
  });

  it('Copy file to folder', async () => {
    const source = `${SOURCE_FOLDER}/test.txt`;
    const destination = DESTINATION_FOLDER;

    return copy(source, destination)
      .then(() => {
        const destinationFiles = getFilesFromDirectory(DESTINATION_FOLDER);
        expect(destinationFiles.length).toBe(1);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/test.txt`);
      });
  });

  it('Copy folder to folder', async () => {
    const source = SOURCE_FOLDER;
    const destination = DESTINATION_FOLDER;

    return copy(source, destination)
      .then(() => {
        const sourceFiles = getFilesFromDirectory(SOURCE_FOLDER);
        expect(sourceFiles.length).toBe(2);
        expect(sourceFiles).toContain(`${SOURCE_FOLDER}/test.txt`);
        expect(sourceFiles).toContain(`${SOURCE_FOLDER}/subfolder/newtest.txt`);

        const destinationFiles = getFilesFromDirectory(DESTINATION_FOLDER);
        expect(destinationFiles.length).toBe(2);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/test.txt`);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/subfolder/newtest.txt`);
      });
  });

});

describe('move', () => {
  const SOURCE_FOLDER = path.join(__dirname, './source');
  const DESTINATION_FOLDER = path.join(__dirname, './destination');

  beforeEach(() => {
    deleteTestFolders();
    createTestFolders();
  });

  afterEach(() => {
    deleteTestFolders();
  });

  it('Move file to folder', async () => {
    const source = `${SOURCE_FOLDER}/test.txt`;
    const destination = DESTINATION_FOLDER;

    return move(source, destination)
      .then(() => {
        const sourceFiles = getFilesFromDirectory(SOURCE_FOLDER);
        expect(sourceFiles).not.toContain(`${DESTINATION_FOLDER}/test.txt`);
        
        const destinationFiles = getFilesFromDirectory(DESTINATION_FOLDER);
        expect(destinationFiles.length).toBe(1);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/test.txt`);
      });
  });

  it('Move folder to folder', async () => {
    const source = SOURCE_FOLDER;
    const destination = DESTINATION_FOLDER;

    return move(source, destination)
      .then(() => {
        const sourceFiles = getFilesFromDirectory(SOURCE_FOLDER);
        expect(sourceFiles.length).toBe(0);

        const destinationFiles = getFilesFromDirectory(DESTINATION_FOLDER);
        expect(destinationFiles.length).toBe(2);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/test.txt`);
        expect(destinationFiles).toContain(`${DESTINATION_FOLDER}/subfolder/newtest.txt`);
      });
  });

});
