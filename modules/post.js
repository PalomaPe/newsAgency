const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require("path");

async function appendToDB(article) {
  let parsedData;
  try {
    const dbdir = path.join(path.dirname(__filename), "../db.json");
    await readFile(dbdir).then((data) => {
      parsedData = JSON.parse(data).valids;
      parsedData.push(article);
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
