const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const upload = require('express-fileupload');
const routes = require('./src/routes/routes');

app.use( cors() );
app.use( express.static('public') );
app.use( upload() );
app.use( express.json() );

app.use( routes );

module.exports = app;
