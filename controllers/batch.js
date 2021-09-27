/*
    Iteración #3: Procesamiento en lotes
    Procesamiento en lotes o batch.
*/

const util = require('util');
const fs = require('fs');

const readFile = util.promisify(fs.readFile);
const path = require('path');
const v = require('../modules/validation');

async function comparision(parsedData, fileName) {
  try {
    const errOut = await v.articleValidation(parsedData, fileName);
    return errOut === '';
  } catch (error) {
    return console.log(error);
  }
}

async function batchProcess(fileName) {
  const datadir = path.join(path.dirname(__filename), '../data', fileName);
  return readFile(datadir).then(async (data) => {
    const d = data.toString();
    const parsedData = JSON.parse(d);
    const out = await comparision(parsedData, fileName);
    return [out, parsedData];
  });
}

async function getAndProcessFiles(filesNames) {
  return Promise.all(filesNames.map((fileName) => batchProcess(fileName)));
}

const readDir = new Promise((resolve, reject) => {
  const arraysArticles = new Object();
  arraysArticles.valids = [];
  arraysArticles.invalids = [];
  const datadir = path.join(path.dirname(__filename), '../data');
  fs.readdir(datadir, (err, filesNames) => {
    if (err) {
      reject(err);
    } else {
      getAndProcessFiles(filesNames).then((arrayBool) => {
        arrayBool.forEach((element) => {
          if (element[0]) arraysArticles.valids.push(element[1]);
          else arraysArticles.invalids.push(element[1]);
        });
        resolve(arraysArticles);
      });
    }
  });
});

readDir
  .then((arraysArticles) => {
    let jsonValids = {};
    jsonValids.valids = arraysArticles.valids;
    jsonValids = JSON.stringify(jsonValids);
    fs.appendFile('db.json', jsonValids, (err) => {
      if (err) console.log(err);
    });
    let jsonInvalids = {};
    jsonInvalids.invalids = arraysArticles.invalids;
    jsonInvalids = JSON.stringify(jsonInvalids);
    fs.appendFile('invalids.json', jsonInvalids, (err) => {
      if (err) console.log(err);
    });
  })
  .catch((err) => {
    console.log(err);
  });
