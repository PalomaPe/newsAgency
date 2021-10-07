/*

  Iteration #4: Basic web server with NodeJS

  Create a web server that exposes the articles stored in the db.json file through a URL.

*/

const http = require('http');

const port = 8080;
const fs = require('fs');
const s = require('./modules/searchByIdDB');

const server = http.createServer(async (request, response) => {
  try {
    response.setHeader('Content-Type', 'application/json');
    request.on('error', (err) => {
      console.error(err);
      response.statusCode = 400;
      response.end();
    });
    response.on('error', (err) => {
      console.error(err);
    });
    if (request.method === 'GET' && request.url === '/articles') {
      const readable = fs.createReadStream('./db.json', { flags: 'a+' });
      return readable.pipe(response);
    }
    if (request.method === 'GET' && request.url.substring(0, 10) == '/articles/' && s.splitURL(request.url)) {
      const article = await s.search(request.url);
      if (article != '' && article != undefined) {
        response.statusCode = 200;
        response.end(JSON.stringify(article));
      } else {
        response.statusCode = 404;
        response.end('There is no document with that id');
      }
    } else {
      console.log(request.url.substring(0, 10));
      response.statusCode = 404;
      response.end('There url is not valid');
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
