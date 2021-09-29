const fs = require("fs");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);
const id = new Object();
function splitURL(requestURL) {
  if (requestURL.length > 36) {
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
