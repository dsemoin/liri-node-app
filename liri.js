// load packages to read and write
var fs = require('fs');
// include npm packages
require("dotenv").config();
var keys = require('./keys');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
// this is to get spotify  and twitter information from keys.js
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// take in command line arguments
var args = process.argv.slice(2);

// Twitter
// parems allow user to search
function getTweets(parems){
client.get('search/tweets', {q: parems, count: 20}, function(error, data, response) {
    if(error) throw error;
    // could also use tweets.statuses.forEach(function(tweet){
    var tweets = data.statuses;
    for (var i = 0; i < tweets.length; i++){
        // Use template literals to break up dates and text
        console.log(`${tweets[i].created_at} -- ${tweets[i].text}`); 
        }
    });
  };
// Spotify
// parems allow user to search
function spotifySong(parems){
spotify
  .search(
      { type:'track',
        query: parems,
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
};  
// Request for imDB
// parems allow user to search
function getMovie(parems) {
  if (!parems){
    parems = 'Mr. Nobody';
  }
  // use encodeURI to instance of certain characters
request('http://www.omdbapi.com/?t=' + encodeURI(parems) + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
  var movie= JSON.parse(body); 
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
  console.log('Title of the movie: ' + movie.Title);
  console.log("The movie's rating is: " + movie.imdbRating);
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
};
// BONUS
// this logs what I search in the terminal in the log.txt file
fs.appendFile("log.txt", args.join(',') + "\n", function(err) {
  if (err) {
    return console.log(err);
  }
});

var tweets = 'my-tweets';
var song = 'spotify-this-song';
var movie = 'movie-this';
var random = 'do-what-it-says';


// create switch statements to get information separately
var media = 'mediaType';
function getInfo(args){
switch (args[0]) {
  case tweets:
     getTweets(args[1]);
      break;   
  case song:
      spotifySong(args[1])
      break;
  case movie:
      getMovie(args[1]);
      break;
  // thi is to read the texfile from the folder
  case random:
    fs.readFile("random.txt", "utf8", function(err, data) {
      if (err) {
        return console.log(err);
      }
      // this calls the switch with the data from the text file and 
      // uses split to separate the command from the title using a comma.
      getInfo(data.split(','));
    });
  }
}
getInfo(args);