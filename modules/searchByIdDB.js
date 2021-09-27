const { request } = require('express');
const fs = require('fs');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const createReadStream = promisify(fs.createReadStream);
const { resolve } = require('path');
const { json } = require('body-parser');

const id = new Object();

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
      articleID = await readFile('./db.json');
      articleID = JSON.parse(articleID).valids;
      articleID = articleID.find((item) => item.id === id.value);
    }
    return articleID;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  splitURL,
  search,
};
