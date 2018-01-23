'use strict';

const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);

app.get('/', (req, res) => {
  res.send('you got me')
});
app.post('/books', (req, res) => {
  res.send('you posted')
});