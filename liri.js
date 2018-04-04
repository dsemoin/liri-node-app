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
        limit: 1
     })
.then(function(data) {
  console.log(data.tracks); 
})
.catch(function(err) {
  console.error('Error occurred: ' + err); 
});
     
//  
//     
// Request


