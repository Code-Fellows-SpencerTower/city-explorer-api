'use strict';

// not using import, using require instead
// requires/imports express
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // lets you use env file

const app = express(); // gives back return value
console.log(app);

app.use(cors()); // acts as middleware - intermediary between server and requests

app.get('/test', handleGetRequest);

function handleGetRequest(request, response) {
  response.send
}



// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));

