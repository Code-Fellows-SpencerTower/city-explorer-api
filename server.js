'use strict';

// not using import, using require instead
// requires/imports express
require('dotenv').config(); // lets you use env file
const express = require('express');
const cors = require('cors');
const app = express(); // gives back return value
app.use(cors()); // acts as middleware - intermediary between server and requests
// import getWeatherData() from weather.js
const weatherReqHandler = require('./routeHandlers/weather');
const movieReqHandler = require('./routeHandlers/movies');

// open route for weather
app.get('/weather', weatherReqHandler);
// open route for movies
app.get('/movies', movieReqHandler);
// send error back to client if page not found
app.get('/*', (req, res) => res.status(404).send('Route Not Found'));
// turn on server
app.listen(process.env.PORT, () => console.log(`server is listening on ${process.env.PORT}`));
