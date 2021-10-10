# newsAgency

NodeJS Training

	Instafeed News Agency

This is the repo where the iterations of the project are stored in their respective branches. Each folder has the script “iterationX” in order to make the execution simpler. Other scripts: npm lint, npm lint-fix, npm run process, npm run start, npm run test, npm run coverage.

Iteration 1, and 2 execute the controller file, process.js, related to local files validation.
Iteration 3 executes the controller batch.js, performing the batch processing of local files.
Iteration 4 executes server.js, a basic web server.
Iterations 5 and 6 execute app.js, which uses Express.js.
Iteration 7 and onwards execute appdb.js, which associates the app with MongoDB.

What went wrong:
How versions were controlled. Iterations weren’t pushed to the git repo as soon as completed, causing dependent code that needed to be pulled apart to obtain the current branches.
Folders and files might not be ordered correctly.
Closing of db not set up.
Did not figure out how to use fs.stat/fs.access without getting an ending program error when a file does not exist.
Not always following a pattern. E.g: using async/await and promises where one of them could be standardized.
Using Mongo for articles and Mongoose for authors, could be standardised too.

What went good:
More accurate use and understanding of promises, promisifying and async / await functioning.
Complete CRUD operations for the articles and authors collections in the database.
New concepts and related procedures management acquired. E.g.: middleware, unit test, test coverage, endpoint protection, logging.
Eslnt configuration.
Implementation of solutions and alternatives.

What could improve:
Security practices in endpoints with OWASP Top 10.
Standardize procedures which can be solved in different ways.
Follow MVC more accurately.

Known Issues:
	1 . The purpose of the endpoint PUT in authorsdb.js and articles.js is to differentiate in the response message sent if the document was updated or created. This response depends on the field nModified of the result returned by the promise Author.updateOne(), if a document was updated the value of the field is 1, 0 otherwise. The issue comes out when the PUT request is sent over an existing document with no modifications in the request body, so nModified becomes 0 and the response shows a document was added. On the other hand, there is a possible fix, in the endpoint PUT implemented for articles in articlesdb.js, the documents in the collection are simply counted before and after the operation and this resolves the message in the response.
