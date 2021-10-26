const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require('path');

async function appendToDB(article) {
  try {
    const dbdir = path.join(path.dirname(__filename), '../db.json');
    /**
     * REVIEW:
     *  Puedes anidar promesas para lograr "mejor claridad" del código.
     *
     *  await readFile(dbdir)
     *   .then(data => JSON.parse(data).valids)
     *   .then(parsedData => ([...parsedData, article]))
     *   .then(saveList => writeFile(dbdir, saveList));
     */
    // const jsonValids = {};
    // jsonValids.valids = [];
    // NEED FIX: anidando promesas
    /*
    await readFile(dbdir)
      .then((data) => JSON.parse(data))
      .then((parsedData) => {
        jsonValids.valids = [...parsedData.valids, article];
      })
      .then((saveList) => JSON.stringify(saveList))
      .then((saveListJSON) => writeFile(dbdir, saveListJSON));
    */
    // OLD CODE:
    let parsedData;
    await readFile(dbdir, { flag: 'a+' }).then((data) => {
      if (data != '') {
        parsedData = JSON.parse(data);
      } else {
        parsedData = { valids: [] };
      }
      parsedData.valids.push(article); // FIX: .valids.push
      parsedData = JSON.stringify(parsedData);
    });
    return writeFile(dbdir, parsedData);
  } catch (err) {
    console.log(err);
  }
}

module.exports = Object.freeze({
  appendToDB,
});
