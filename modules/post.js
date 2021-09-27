const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require("path");

async function appendToDB(article) {
  let jsonArticles = {};
  try {
    const dbdir = path.join(path.dirname(__filename), "../db.json");
    jsonArticles.valids = [];
    jsonArticles.valids.push(article);
    fs.appendFileSync("./db.json", "");
    await readFile(dbdir).then((data) => {
      let dataString = data.toString();
      if (dataString != "") {
        let oldValids = JSON.parse(dataString);
        jsonArticles.valids = jsonArticles.valids.concat(oldValids.valids);
      }
      jsonArticles = JSON.stringify(jsonArticles);
    });
    return writeFile(dbdir, jsonArticles);
  } catch (err) {
    console.log(err);
  }
}

async function appendToInvalids(article) {
  let jsonArticles = {};
  try {
    const invdir = path.join(path.dirname(__filename), "../invalids.json");
    jsonArticles.invalids = [];
    jsonArticles.invalids.push(article);
    fs.appendFileSync("./invalids.json", "");
    await readFile(invdir).then((data) => {
      let dataString = data.toString();
      if (dataString != "") {
        let oldValids = JSON.parse(dataString);
        jsonArticles.invalids = jsonArticles.invalids.concat(
          oldValids.invalids
        );
      }
      jsonArticles = JSON.stringify(jsonArticles);
    });
    return writeFile(invdir, jsonArticles);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  appendToDB,
  appendToInvalids,
};
