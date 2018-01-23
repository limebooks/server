'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
const cors = require('cors');
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', (req, res) => {
  res.send('you got me')
});
app.post('/books', (req, res) => {
  res.send('you posted')
});
app.get('/db/books', function (request, response) {
  client.query('SELECT * FROM books;')
    .then(function (data) {
      response.send(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.post('/db/books', function (request, response) {
  client.query(`
    INSERT INTO books(bookName, author, imageUrl)
    VALUES($1, $2, $3);
    `,
    [
      request.body.bookName,
      request.body.author,
      request.body.imageUrl
    ]
  )
    .then(function (data) {
      response.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
    });
});

createTable();

app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
});

function createTable() {
  client.query(`
    CREATE TABLE IF NOT EXISTS books(
      id SERIAL PRIMARY KEY,
      bookName VARCHAR(256),
      author VARCHAR(256),
      imageUrl VARCHAR(256)
    );`
  )
    .then(function (response) {
      console.log('created table in db!!!!');
    });
};