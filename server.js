'use strict';

const cors = require('cors');
const express = require('express');
const pg = require('pg');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT;

const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
client.connect();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('', (req, res) => {
  res.send('you got me')
});
// app.post('/books', (req, res) => {
//   res.send('you posted')
// });
app.get('/db/book', function (request, response) {
  client.query('SELECT * FROM books;')
    .then(function (data) {
      response.send(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.post('/db/book', function (request, response) {
  client.query(`
    INSERT INTO books(title, author, url, book_id, isbn, description)
    VALUES($1, $2, $3, $4, $5, $6);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.url,
      request.body.book_id,
      request.body.isbn,
      request.body.description
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
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(256),
      author VARCHAR(256),
      url VARCHAR(256),
      isbn INTEGER,
      description VARCHAR(800)
    );`
  )
    .then(function (response) {
      console.log('created table in db!!!!');
    });
};