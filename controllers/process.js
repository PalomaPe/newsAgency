/*

  Iteration #1: Writing files. Validation

  Read files and perform validation on their content.

*/

const fs = require("fs");
const v = require("../modules/validation");
const sV = require("../modules/schemaValidation");
const stdin = process.openStdin();

function getAndValidateFiles(filename) {
  fs.readFile(`data/${filename}`, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    v.articleValidation(JSON.parse(data), filename);
  });
}

async function getAndValidateFilesSchema(filename) {
  fs.readFile(`data/${filename}`, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    sV.schemaArticleValidation(data, filename);
  });
}

console.log(
  "Write the name of a file to validate. -  E.g.: 2d77b0c6-858f-407f-a518-58371ac9adcb.json"
);

stdin.addListener("data", function (filename) {
  let fileName = filename.toString().trim();
  getAndValidateFiles(fileName);
  getAndValidateFilesSchema(fileName);
});
