const fs = require('fs');

const getAllArticles = (req, res) => {
  fs.readFile('./db.json', { flag: 'a+' }, (err, data) => {
    if (err) {
      console.log(err);
      res.json({ message: err });
    } else {
      let d = data.toString();
      if (d == '') {
        return res
          .status(404)
          .json({ message: 'There are no documents in database' });
      }
      // d = JSON.parse(data);
      // REVIEW:
      // Como indicaste que la codificación es JSON podrías hacer
      //
      //  res.status(200).json(d);
      //
      //  No solamente envía un json, sino que establece el header Content-Type como json,
      //  lo cual significa que la línea 9 no aplica.
      d = JSON.parse(data);
      return res.status(200).json(d);
    }
  });
};

module.exports = Object.freeze(getAllArticles);
