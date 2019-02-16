require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var axios = require("axios");
var moment = require('moment');
var fs = require("fs");

var thirdCommand = process.argv[2];
var fourthCommand = process.argv[3];

if (thirdCommand === 'concert-this') {
  axios.get("https://rest.bandsintown.com/artists/" + fourthCommand + "/events?app_id=codingbootcamp")
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
else if (thirdCommand === 'spotify-this-song') {
  spotify.search({ type: 'track', query: fourthCommand }, function(err, response) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
    else if (fourthCommand === undefined) {
      console.log("Name of album: The Sign (US Album) [Remastered] \nArtist: Ace of Base \nPreview link: https://p.scdn.co/mp3-preview/4c463359f67dd3546db7294d236dd0ae991882ff?cid=74cf423243964f9bb0f9e85abfe1db49 \nSong: The Sign");
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
else if (thirdCommand === 'movie-this') {
  if (fourthCommand === undefined) {
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/ \nIt's on Netflix!");
  } else {
      axios.get("http://www.omdbapi.com/?t=" + fourthCommand + "&apikey=b5f5e0a1")
      .then(function(response){

        var jsonData = response.data;
        var movieInfo = [
          "Title: " + jsonData.Title,
          "Year: " + jsonData.Year,
          "Rotten Tomatoes: " + jsonData.Ratings[1].Value,
          "IMBD Rating: " + jsonData.imdbRating,
          "Country: " + jsonData.Country,
          "Language: " + jsonData.Language,
          "Plot: " + jsonData.Plot
        ].join("\n\n");
      })
      .catch(function (error){
        console.log(error);
      });
  }
} 
else if (thirdCommand === 'do-what-it-says') {
  fs.readFile("random.txt", "utf8", function(error, data){
    if (error) {
      return console.log('Problem reading the file: ', error);
    }
    console.log(data);
    var dataArr = data.split(",");
    console.log(dataArr);
  })
}



