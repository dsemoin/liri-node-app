// load packages to read and write
var fs = require('fs');
// include npm packages
require("dotenv").config();
var keys = require('./keys');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// this is to get spotify information from keys.js
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// take in command line arguments
var args = process.argv.slice(2);
console.log(args);

// Twitter
client.get('search/tweets', {q: 'science', count: 20}, function(error, data, response) {
    if(error) throw error;
    // could also use tweets.statuses.forEach(function(tweet){
    var tweets = data.statuses;
    for (var i = 0; i < tweets.length; i++){
        // Use template literals to break up dates and text
        console.log(`${tweets[i].created_at} -- ${tweets[i].text}`); 
        }
    });


spotify
  .search(
      { type:'track',
        query: 'All the small things',
        limit:1
     })
.then(function(data) {
  // parse data from package
  var track = data.tracks.items[0]; 
  console.log(track.album.name);
  console.log(track.name);
  // use map to call the element from the array and return only artist's name
  console.log(track.artists.map(function(e){
    return e.name;
    // for multiple artists use .join
  }).join(','));
  console.log(track.preview_url);
})
.catch(function(err) {
  console.error('Error occurred: ' + err); 
  console.log(JSON.stringify(data, null, 2));

});    
// Request for imDB

request('http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy', function (error, response, body) {
  var movie= JSON.parse(body); 
  
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log("The movie's rating is: " + movie.imdbRating);
  console.log('Title of the movie: ' + movie.Title);
  console.log('Year the movie came out: ' + movie.Year);
  console.log('Country where the movie was produced: ' + movie.Country);
  console.log('Language of the movie: ' + movie.Language);
  console.log('Plot of the movie: ' + movie.Plot);
  console.log('Actors in the movie: ' + movie.Actors);
  // use .find to parse out rotten tomatoes ratings from the tree ratings
  console.log('Rotten Tomatoes Rating of the movie: ' + movie.Ratings.find(function(e){
    return e.Source == "Rotten Tomatoes";
  }).Value);
});



