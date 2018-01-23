'use strict';

const __API_URL__ = DATABASE_URL;
const pg = require('pg');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT;
const app = express();
const conString = process.env.DATABASE_URL;
const client = new pg.Client(conString);
const cons = require('cons');
app.get(`${__API_URL__}/`, (req, res) => {
  res.send('you got me')
});
app.post(`${__API_URL__}/books`, (req, res) => {
  res.send('you posted')
});