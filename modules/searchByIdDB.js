const { request } = require("express");
const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
var id = new Object();

function splitURL(requestURL) {
  if (requestURL.length > 36) {
    id.value = requestURL.substring(10, 46);
  } else {
    id.value = requestURL;
  }
  id.valid = id.value.length == 36;
  return id.valid;
}

async function search(requestURL) {
  let articleID = null;
  splitURL(requestURL);
  try {
    if (id.valid) {
      articleID = await readFile("./db.json");
      articleID = JSON.parse(articleID).valids;
      articleID = articleID.find((item) => item.id === id.value);
    }
    if (articleID != undefined) return articleID;
    else return "There is no document with id " + id.value;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  splitURL,
  search,
};
