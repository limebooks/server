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

app.use(function (req, res, next) {
  req.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('', (req, res) => {
  res.send('you got me')
});
// app.post('/books', (req, res) => {
//   res.send('you posted')
// });
app.get('/api/v1/books', function (request, response) {
  client.query('SELECT * FROM books;')
    .then(function (result) {
      response.send(result.rows);
    })
    .catch(function (err) {
      console.error(err);
    });
});
app.get('/api/v1/books/:id', (req, res) => {
  client.query(
    'SELECT * FROM books WHERE book_id=$1;',
    [req.params.id])
    .then(result => res.send(result.rows))
});

// app.get('/test', (req, res) => res.send('hello world'));

app.post('/api/v1/books', function (request, response) {
  client.query(`
    INSERT INTO books(author, title, isbn, url, description)
    VALUES($1, $2, $3, $4, $5);
    `,
    [
      request.body.title,
      request.body.author,
      request.body.url,
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


function createTable() {
  client.query(`
  CREATE TABLE IF NOT EXISTS books(
    book_id SERIAL PRIMARY KEY,
    title VARCHAR(256),
    author VARCHAR(256),
    url VARCHAR(256),
    isbn INTEGER,
    description VARCHAR(800)
  );`)
  .then(function (response) {
    console.log('created table in db!!!!');
  });
}

app.put('/api/db/:id', (req, res) => {
  console.log('HIT PUT ROUTE');
  client.query(
    'UPDATE books SET author=$1,title=$2,isbn=$3,url=$4,description=$5 WHERE book_id=$6;',
    [req.body.author, req.body.title, req.body.isbn, req.body.url, req.body.description, req.params.id],
    err => console.error(err)
  );
});

//DELETES
app.delete('/api/db/:id', (req, res) => {
  client.query(
    'DELETE FROM books WHERE book_id=$1;',
    [req.params.id],
    err => console.error(err)
  );
});




app.listen(PORT, () => {
  console.log(`currently listening on ${PORT}`);
})
