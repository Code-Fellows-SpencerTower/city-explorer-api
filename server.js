'use strict';

// not using import, using require instead
// requires/imports express
require('dotenv').config(); // lets you use env file
const axios = require('axios');
const express = require('express');
const cors = require('cors');
const weatherData = require('./data/weather.json');
const app = express(); // gives back return value
app.use(cors()); // acts as middleware - intermediary between server and requests

// opens up a route for /weather, calls handleGetWeather when route recieves query
app.get('/weather', handleGetWeather);
app.get('/movies', handleGetMovie);
// send error back to client if page not found
app.get('/*', (req, res) => res.status(404).send('Route Not Found'));
// turn on server
app.listen(process.env.PORT, () => console.log('server is listening on PORT 3001'));


async function handleGetWeather(req, res) {
  // set up endpoint to accept city_name as param
  console.log(req.query);
  // let city_name = req.query.city_name;
  // let city_match = weatherData.find(city => city.city_name.toLowerCase() === city_name.toLowerCase());
  // console.log('city_match', city_match);

  try {
    // map to Forecast, returns obj with datetime and description as properties
    const liveWeather = await axios.get(`http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHER_API_KEY}&units=I&days=7`);
    console.log(liveWeather.data);
    const liveWeatherRes = liveWeather.data.data.map(day => new Forecast(day));
    // send city weather data description to client
    res.status(200).send(liveWeatherRes);
  } catch (error) {
    // How to send api error back to client??
    // if (liveWeather.status_code) {
    //   res.send(`Error: ${liveWeather.status_code}. ${liveWeather.status_message}.`);
    // }
    // Change message
    res.status(400).send(`There was an error retrieving weather data for ${req.query.city_name}.`);
    // how to catch api error and send back to client?
  }
}

async function handleGetMovie(req, res) {
  try {
    const movieData = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.city_name}&adult=false`);
    // map into new Movie obj, put in variable to send back to client
    const movieRes = movieData.data.map(movie => new Movie(movie));
    res.status(200).send(movieRes);
  } catch (error) {
    res.status(400).send(`There was an error retrieving movie data for ${req.query.city_name}.`);
  }
}

class Forecast {
  constructor(obj) {
    this.date = obj.datetime;
    this.description = `High of ${obj.max_temp}, Low of ${obj.low_temp}, with ${obj.weather.description} `;

  }
}

class Movie {
  constructor(obj) {
    this.title = obj.title;
    this.overview = obj.overview;
    this.avg_votes = obj.average_votes;
    this.total_votes = obj.total_votes;
    this.img_url = obj.image_url;
    this.popularity = obj.popularity;
    this.release_date = obj.released_on;
  }
}

    // "title": "Sleepless in Seattle",
    // "overview": "A young boy who tries to set his dad up on a date after the death of his mother. He calls into a radio station to talk about his dad’s loneliness which soon leads the dad into meeting a Journalist Annie who flies to Seattle to write a story about the boy and his dad. Yet Annie ends up with more than just a story in this popular romantic comedy.",
    // "average_votes": "6.60",
    // "total_votes": "881",
    // "image_url": "https://image.tmdb.org/t/p/w500/afkYP15OeUOD0tFEmj6VvejuOcz.jpg",
    // "popularity": "8.2340",
    // "released_on": "1993-06-24"


