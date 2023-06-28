const { copy, move } = require('../lib.js');
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
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(true);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
      });
  });

  it('Copy folder to folder', async () => {
    const source = SOURCE_FOLDER;
    const destination = DESTINATION_FOLDER;

    return copy(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(true);
        expect(fs.existsSync(`${SOURCE_FOLDER}/subfolder/newtest.txt`)).toBe(true);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
        expect(fs.existsSync(`${DESTINATION_FOLDER}/subfolder/newtest.txt`)).toBe(true);
      });
  });

  it('Copy file to file', async () => {
    const source = `${SOURCE_FOLDER}/test.txt`;
    const destination = `${DESTINATION_FOLDER}/test.txt`;

    return copy(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(true);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
      });
  });

  it('Copy folder to file', async () => {
    const source = `${SOURCE_FOLDER}/`;
    const destination = `${DESTINATION_FOLDER}/test.txt`;

    return copy(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(true);
        expect(fs.existsSync(`${SOURCE_FOLDER}/subfolder/newtest.txt`)).toBe(true);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt/test.txt`)).toBe(true);
        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt/subfolder/newtest.txt`)).toBe(true);
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
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(false);
        
        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
      });
  });

  it('Move folder to folder', async () => {
    const source = SOURCE_FOLDER;
    const destination = DESTINATION_FOLDER;

    return move(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(false);
        expect(fs.existsSync(`${SOURCE_FOLDER}/subfolder/newtest.txt`)).toBe(false);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
        expect(fs.existsSync(`${DESTINATION_FOLDER}/subfolder/newtest.txt`)).toBe(true);
      });
  });

  it('Move file to file', async () => {
    const source = `${SOURCE_FOLDER}/test.txt`;
    const destination = `${DESTINATION_FOLDER}/test.txt`;

    return move(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(false);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt`)).toBe(true);
      });
  });

  it('Move folder to file', async () => {
    const source = `${SOURCE_FOLDER}/`;
    const destination = `${DESTINATION_FOLDER}/test.txt`;

    return move(source, destination)
      .then(() => {
        expect(fs.existsSync(`${SOURCE_FOLDER}/test.txt`)).toBe(false);
        expect(fs.existsSync(`${SOURCE_FOLDER}/subfolder/newtest.txt`)).toBe(false);

        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt/test.txt`)).toBe(true);
        expect(fs.existsSync(`${DESTINATION_FOLDER}/test.txt/subfolder/newtest.txt`)).toBe(true);
      });
  });

});
