require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

var thirdCommand = process.argv[2];
var fourthCommand = process.argv[3];

// Spotfy search
function spotifySearch(song) {
  spotify.search({ type: 'track', query: song }, function(err, response) {
   
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    var items = response.tracks.items;
    for(var i = 0; i < items.length; i++ ) {
      // Name of the album (works)
      console.log("Name of album: " + items[i].album.name);

      // Name of the artist (works) (need to loop through artists)
      var artists = items[i].artists;
      for(var j = 0; j < artists.length; j++) {
        console.log("Artist: " + artists[j].name);
      }
      // Preview link from Spotify
      console.log("Preview link: " + items[i].preview_url);
      // Song name
      console.log("Song: " + items[i].name);
      // Divider
      console.log("-------");
    }
   
  })
}
// The Sign default search
function theSignSearch() {
  spotify.search({ type: 'track', query: "The Sign" }, function(err, response) {
   
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    
    var items = response.tracks.items;
    for(var i = 0; i < items.length; i++ ) {
      if ("The Sign" === items[i].name) {
        // Name of the album (works)
        console.log("Name of album: " + items[i].album.name);

        // Name of the artist (works) (need to loop through artists)
        var artists = items[i].artists;
        for(var j = 0; j < artists.length; j++) {
          console.log("Artist: " + artists[j].name);
        }
        // Preview link from Spotify
        console.log("Preview link: " + items[i].preview_url);
        // Song name
        console.log("Song: " + items[i].name);
        // Divider
        console.log("-------");
      }
    }
  })
}
// Movie search
function movieSearch(movieName){
  axios.get("http://www.omdbapi.com/?t=" + movieName + "&apikey=b5f5e0a1")
    .then(function(response){
      var jsonData = response.data;
      if (jsonData.Error === 'Movie not found!') {
        console.log(jsonData.Error);
        return;
      }
      var movieInfo = [
        "Title: " + jsonData.Title,
        "Year: " + jsonData.Year,
        "Rotten Tomatoes: " + jsonData.Ratings[1].Value,
        "IMBD Rating: " + jsonData.imdbRating,
        "Country: " + jsonData.Country,
        "Language: " + jsonData.Language,
        "Plot: " + jsonData.Plot
      ].join("\n\n");
      console.log(movieInfo);
    })
    .catch(function (error){
      console.log(error);
    });
}
// Concert search 
function concertSearch(artistName) {
  axios.get("https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp")
  .then(function (response) {
    var data = response.data;
    for(var i = 0; i < data.length; i++) {
      console.log("Venue: " + data[i].venue.name);
      console.log("Location: " + data[i].venue.city + ", " + data[i].venue.country);
      console.log("Date: " + moment(data[i].datetime).format("MM/DD/YYYY"));
      console.log();
    }
  })
  .catch(function (error) {
    console.log(error);
  });
}
if (thirdCommand === 'concert-this') {
  concertSearch(fourthCommand);
} 
else if (thirdCommand === 'spotify-this-song') {
  if (fourthCommand === undefined){
    theSignSearch();
    return;
  }
  spotifySearch(fourthCommand);
} 
else if (thirdCommand === 'movie-this') {
  if (fourthCommand === undefined) {
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/ \nIt's on Netflix!");
  } else {
    movieSearch(fourthCommand);
  }
} 
// fs node package
else if (thirdCommand === 'do-what-it-says') {
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
      return console.log('Problem reading the file: ', error);
    }
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
    if (dataArr[0] === "spotify-this-song") {
      spotifySearch(dataArr[1]);
    }
    else if (dataArr[0] === "concert-this") {
      concertSearch(dataArr[1]);
    }
    else if (dataArr[0] === "movie-this") {
      movieSearch(dataArr[1]);
    };
  })
}