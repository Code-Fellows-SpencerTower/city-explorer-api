'use strict';

const axios = require('axios');
const cache = require('../cache');

// refactor to check query and recieve lat, lon
async function getMovieData(lat, lon) {

  const key = 'movie-' + lat + lon;
  const moviedbUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&query=${req.query.city_name}&adult=false`;

  console.log('cache: ', cache);
  // check if data for query is in cache and up to date
  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache data found');
  } else { // get new data via axios from movie db, parse, and update cache
    console.log('No cache data found');
    cache[key] = {}; // add obj to key in cache
    cache[key].timestamp = Date.now(); // add current date/time to timestamp in cache
    cache[key].data = parseMovieData(await axios.get(moviedbUrl)); // get current data from movie db
    // console.log('Axios Movie Data: ', await axios.get(moviedbUrl));
    // console.log('cache[key].data: ', cache);
    // console.log('cache[key].data: ', cache[key].data);
  }

  return cache[key].data;
}

function parseMovieData(movieData) {
  const movie = movieData.data.data.map(day => new Movie(day));
  return movie;
}

class Movie {
  constructor(obj) {
    this.title = obj.original_title;
    this.overview = obj.overview;
    this.avg_votes = obj.vote_average;
    this.total_votes = obj.vote_count;
    this.img_url = obj.poster_path ? `https://image.tmdb.org/t/p/w500${obj.poster_path}` : 'https://www.lacinefest.org/uploads/2/6/7/4/26743637/no-poster_orig.jpeg';
    this.popularity = obj.popularity;
    this.release_date = obj.release_date;
  }
}

module.exports = getMovieData;
