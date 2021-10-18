const fs = require("fs");
const { promisify } = require("util");
// REVIEW:
//  Dado que el uso de promisify es muy común y fs es uno de los módulos más utilizado,
//  Nodejs trae un soporte nativo para promesas con fs.
//
//   fs.promises.readFile
//   https://nodejs.org/dist/latest-v14.x/docs/api/fs.html#fs_promises_api
const readFile = promisify(fs.readFile);

const id = new Object();

function splitURL(requestURL) {
  if (requestURL.length > 36) {
    // REVIEW:
    // No hay garantía de que tenga al menos 47 caracteres.
    // Lo único que está seguro acá es que tiene más de 36,
    // lo cual podría ser 37, 38, ..., 46.
    id.value = requestURL.substring(10, 47);
  } else {
    console.log("here");
    id.value = requestURL;
  }
  id.valid = id.value.length == 36;
  return id.valid;
}

async function search(requestURL) {
  let articleID = "";
  splitURL(requestURL);
  try {
    if (id.valid) {
      articleID = await readFile("./db.json", { flag: "a+" });
      articleID = articleID.toString();
      if (articleID != "") {
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
