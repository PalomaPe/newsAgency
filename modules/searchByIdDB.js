const fs = require('fs/promises'); // FIX: fs.promisify(fs.readFile) => require fs/promises
// const { promisify } = require("util");
// REVIEW:
//  Dado que el uso de promisify es muy común y fs es uno de los módulos más utilizado,
//  Nodejs trae un soporte nativo para promesas con fs.
//
//   fs.promises.readFile
//   https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_promises_api

//   const readFile = promisify(fs.readFile);

const id = {};

function splitURL(requestURL) {
  if (requestURL.length == 46) {
    // FIX: ask for the url being 46 char long, (/articles/ + id 36 char long)
    // REVIEW:
    // No hay garantía de que tenga al menos 47 caracteres.
    // Lo único que está seguro acá es que tiene más de 36,
    // lo cual podría ser 37, 38, ..., 46.
    id.value = requestURL.substring(10, 47);
  } else {
    id.value = requestURL;
  }
  id.valid = id.value.length == 36;
  return id.valid;
}

async function search(requestURL) {
  let articleID = '';
  splitURL(requestURL);
  try {
    if (id.valid) {
      articleID = await fs.readFile('./db.json', { flag: 'a+' });
      articleID = articleID.toString();
      if (articleID != '') {
        articleID = JSON.parse(articleID).valids;
        articleID = articleID.find((item) => item.id === id.value);
      }
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
