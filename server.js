'use strict';

// not using import, using require instead
// requires/imports express
require('dotenv').config(); // lets you use env file
const express = require('express');
const cors = require('cors');
const app = express(); // gives back return value
app.use(cors()); // acts as middleware - intermediary between server and requests
// import getWeatherData() from weather.js
const getWeatherData = require('./routeHandlers/weather');
const handleGetMovie = require('./routeHandlers/movies');

// open route for weather
app.get('/weather', weatherReqHandler);
// open route for movies
app.get('/movies', handleGetMovie);
// send error back to client if page not found
app.get('/*', (req, res) => res.status(404).send('Route Not Found'));
// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));

// handle req from client, pass to weather.js, send res to client
function weatherReqHandler(req, res) {
  // assign lat lon from query to variables
  const { lat, lon } = req.query;
  // pass lat and lon into getWeather() in weather.js to get data from cache or new axios request
  const weatherData = getWeatherData(lat, lon);
  res.status(200).send(weatherData);
  // add error handler
}

