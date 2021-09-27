/*

  Iteration #4: Basic web server with NodeJS

  Create a web server that exposes the articles stored in the db.json file through a URL.
  
*/

const http = require("http");

const port = 8080;
const fs = require("fs");
const s = require("./modules/searchByIdDB");

const server = http.createServer(async (request, response) => {
  try {
    response.setHeader("Content-Type", "application/json");
    request.on("error", (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on("error", (err) => {
      console.error(err);
    });
    if (request.method === "GET" && request.url === "/articles") {
      const readable = fs.createReadStream("./db.json", { flags: "a+" });
      readable.pipe(response);
    } else {
      response.statusCode = 404;
    }
    if (request.method === "GET" && s.splitURL(request.url)) {
      const article = await s.search(request.url);
      response.end(JSON.stringify(article));
    } else if (!request.url === "/articles") {
      response.statusCode = 404;
      response.end("The id is not valid");
    }
    /* server.close(() => {
      console.log("server is closed");
    }); */
  } catch (error) {
    console.log(error);
  }
});

server.listen(port, () => {
  console.log(`Server listening on PORT: ${port}`);
});
