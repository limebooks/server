'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
const cons = require('cons');
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
app.get('/db/person', function (request, response) {
  client.query('SELECT * FROM persons;')
    .then(function (data) {
      response.send(data);
    })
    .catch(function (err) {
      console.error(err);
    });
});

app.post('/db/person', function (request, response) {
  client.query(`
    INSERT INTO persons(name, age, ninja)
    VALUES($1, $2, $3);
    `,
    [
      request.body.name,
      request.body.age,
      request.body.ninja
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
    CREATE TABLE IF NOT EXISTS persons(
      id SERIAL PRIMARY KEY,
      name VARCHAR(256),
      age INTEGER,
      ninja BOOLEAN
    );`
  )
    .then(function (response) {
      console.log('created table in db!!!!');
    });
};