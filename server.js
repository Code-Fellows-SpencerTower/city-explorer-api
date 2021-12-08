'use strict';

// not using import, using require instead
// requires/imports express
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // lets you use env file
const weatherData = require('./data/weather.json');

const app = express(); // gives back return value
console.log(app);

app.use(cors()); // acts as middleware - intermediary between server and requests

app.get('/weather', handleGetWeather);



function handleGetWeather(request, response) {
  // sends weather array and 200 (ok) .status(200) response
  console.log(request.query);
  // let newForecast = weatherData.map(location => new Forecast(location));
  // sends back datetime
  response.status(200).send(weatherData);
  // with status
}

// class Forecast {
//   constructor(object) {
//     this.date = object.datetime;
//     this.description = object.description;

//   }
// }


// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));

