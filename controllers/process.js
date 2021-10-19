/*

  Iteration #2: Writing files

  Extend the implementation of iteration #1 to centralize successfully validated articles in a database in files.

*/

const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const path = require('path');
const v = require('../modules/validation');

const stdin = process.openStdin();

async function comparision(parsedData, fileName) {
  try {
    const errOut = await v.articleValidation(parsedData, fileName);
    return errOut === '';
  } catch (error) {
    return console.log(error);
  }
}

async function batchProcess(fileName, arrayArticles) {
  try {
    const datadir = path.join(path.dirname(__filename), '../data', fileName);
    return readFile(datadir).then(async (data) => {
      const d = data.toString();
      const parsedData = JSON.parse(d);
      const out = await comparision(parsedData, fileName);
      if (out) arrayArticles.valids.push(parsedData);
      else arrayArticles.invalids.push(parsedData);
      return out;
    });
  } catch (err) {
    return err;
  }
}

const readDir = new Promise((resolve, reject) => {
  const arrayArticles = {};
  arrayArticles.valids = [];
  arrayArticles.invalids = [];
  console.log(
    'Write the name of a file to validate. -  E.g.: 2d77b0c6-858f-407f-a518-58371ac9adcb.json',
  );
  stdin.addListener('data', (filename) => {
    batchProcess(filename.toString().trim(), arrayArticles)
      .then((out) => {
        if (out) {
          const dbdir = path.join(path.dirname(__filename), '../db.json');
          fs.appendFileSync('./db.json', '');
          readFile(dbdir)
            .then((data) => {
              const dataString = data.toString();
              if (dataString != '') {
                const oldValids = JSON.parse(dataString);
                arrayArticles.valids = arrayArticles.valids.concat(
                  oldValids.valids,
                );
              }
            })
            .then(() => {
              resolve(arrayArticles);
            })
            .catch((err) => reject(err));
        } else {
          const invdir = path.join(
            path.dirname(__filename),
            '../invalids.json',
          );
          fs.appendFileSync('./invalids.json', '');
          readFile(invdir)
            .then((data) => {
              const dataString = data.toString();
              if (dataString != '') {
                const oldInvalids = JSON.parse(dataString);
                arrayArticles.invalids = arrayArticles.invalids.concat(
                  oldInvalids.invalids,
                );
              }
            })
            .then(() => {
              resolve(arrayArticles);
            })
            .catch((err) => reject(err));
        }
      })
      .catch((err) => reject(err));
  });
});

readDir
  .then((arrayArticles) => {
    if (arrayArticles.valids.length > 0) {
      let jsonValids = {};
      jsonValids.valids = arrayArticles.valids;
      jsonValids = JSON.stringify(jsonValids);
      fs.writeFile('db.json', jsonValids, (err) => {
        if (err) console.log(err);
      });
    }
    if (arrayArticles.invalids.length > 0) {
      let jsonInvalids = {};
      jsonInvalids.invalids = arrayArticles.invalids;
      jsonInvalids = JSON.stringify(jsonInvalids);
      fs.writeFile('invalids.json', jsonInvalids, (err) => {
        if (err) console.log(err);
      });
    }
  })
  .catch((err) => {
    console.log(err);
  });
