import {getLocation, lat, lon, locationRetrieved, KtoF, niceDate, niceTime, windDirection} from './utils.js';

//  I need these data in a couple of places so I will place them at the top of the JavaScript
//  so I get the reference only once
let json = document.getElementById('json');

//  add event listeners to the buttons on the HTML page
document.getElementById('getMovies' ).addEventListener('click', getMovies);
document.getElementById('getWeather').addEventListener('click', getWeather);
document.getElementById('getNasa'   ).addEventListener('click', getNasa);

getLocation('weatherList');      //  trigger the request to get the current location

//  Enter a movie title in the search box and press the button
function getMovies() {
    let movieList = document.getElementById('movieList');       //  where we will put our list of matching movies
    let movieTitle = document.getElementById('movie');          //  movie title entry field
    let url = `https://imdb-api.com/en/API/SearchMovie/k_lLeNEBFq/`;

    //  no movie? no search
    if (movieTitle.length == 0) {
        movieList.innerText = "Enter a Movie to search for"
        return;
    }

    //  add movie to the search API
    url += movieTitle.value;

    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(movies => {
            if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
                document.body.innerText = JSON.stringify(movies);       //  if the box is clicked only show the JSON result
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "<div class='grid-container'>";

            //  there is a little bit of data with this API not much.
            //  if you want more details click on the movie image
            for (let movie of movies.results) {
                //  let's build a nice card for each movie
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                innerHTML +=
                    `<div class="grid-item">
                        <a href="https://www.imdb.com/title/${movie.id}">
                            <h4>${movie.title}</h4>
                        </a>
                        <h4>Description: ${movie.description}</h4>
                        <img src='${movie.image}' height="200px" id="${movie.id}">
                    </div>`
            }
            innerHTML += "</div>";

            //  and finally take the finished HTML and stuff it into the web page
            movieList.innerHTML = innerHTML

            //  we can't add the event listener until now because the elements do not exist until
            //  AFTER the innerHTML takes effect and creates the individual elements for each movie
            for (let movie of movies.results) {
                //  NOW we can add a click event listener for the image which will show us the movie details
                document.getElementById(movie.id).addEventListener('click', movieDetails)
            }
        });
}

//  The user can get more movie details by clicking on the movie poster to get to this code
function movieDetails() {
    let movieList = document.getElementById('movieList');   //  this is where we will put our movie details

    //  the id of the image is the IMDB ID we want details on
    let url = `https://imdb-api.com/en/API/Title/k_qa7p2g6c/${this.id}`;    //  search for movies with this ID

    //  using the movie details API get additional data about the movie
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
                document.body.innerText = JSON.stringify(movie);       //  if the box is clicked only show the JSON result
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "<div class='grid-container'>";

            //  there is a LOT of data with this API. We will only do something with the array of actors data
            //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
            innerHTML +=
                `<div class="grid-item">
                    <h4>Description: ${movie.title}</h4>
                    <h4>Relesase Date: ${movie.releaseDate}</h4>
                    <h4>Plot: ${movie.plot}</h4>
                    <img src='${movie.image}' height="200px"'>
                <ul>`;
            //  show the actor's name, picture, the character they playe and add a link to IMDB for the actor
            // for (let actor of movie.actorList) {
            //     innerHTML +=
            //         `<li>
            //             <a href="https://www.imdb.com/name/${actor.id}">
            //                 <img src="${actor.image}" height="120px" alt="">
            //             </a>
            //             Name: ${actor.name} as ${actor.asCharacter}
            //         </li>`
            // }
            innerHTML += "</ul></div></div>";
            //  and finally take the finished URL and stuff it into the web page
            movieList.innerHTML = innerHTML
        });
}

//  this will return data on your local weather for the next 8 days.
function getWeather() {
    let weatherList = document.getElementById('weatherList')

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude={part}&appid=a099a51a6362902523bbf6495a0818aa`;
    //  api.openweathermap.org/data/2.5/weather?q={city name}&appid=

    if (!locationRetrieved) {
        weatherList.innerText = "Be patient, location not yet retrieved";
        return;
    }

    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(response => response.json())          //  wait for the response and convert it to JSON
        .then(wx => {                               //  with the resulting JSON data do something
            if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
                document.body.innerText = JSON.stringify(wx);       //  if the box is clicked only show the JSON result
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            //  We will build the HTML to be inserted later.
            //  The variable innerHTML will hold our work in progress
            let innerHTML = "<div class='grid-container'>";

            //  there is a LOT of data with this API. We will only do something with the array of daily data
            for (let day of wx.daily) {
                //  let's build a nice card for each day of the weather data
                //  this is a GREAT opportunity to Reactify this code. But for now I will keep it simple
                innerHTML +=
                    `<div class="grid-item">
                        <h4>Date: ${niceDate(day.dt, wx.timezone_offset)}</h4>
                        <h5>Sunrise: ${niceTime(day.sunrise, wx.timezone_offset)} Sunset: ${niceTime(day.sunset, wx.timezone_offset)}</h5>
                        <p>Temp: Low ${KtoF(day.temp.min)}&deg; High: ${KtoF(day.temp.max)}&deg;</p>
                        <p>Forecast: <img src='http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png'> ${day.weather[0].description}</p>
                        <p>Chance of rain ${day.pop * 100}% Rain Fall ${day.rain} inches</p>
                        <p>Wind at ${day.wind_speed} out of the ${windDirection(day.wind_deg)}</p>
                    </div>`
            }
            innerHTML += "</div>";
            //  and finally take the finished URL and stuff it into the web page
            weatherList.innerHTML = innerHTML
        });
}

//  Simple URL to get the NASA Astronomy Picture of the day.
//  I am just getting the basic info here. I am not doing anything with videos (yet)
//  I just want you to see the repeating pattern of
//      doing a fetch,
//      converting result text to JSON
//      and pulling data from the JSON and showing it to the user
function getNasa() {
    let url = 'https://api.nasa.gov/planetary/apod?api_key=Aw0TZ7aE7e6WJnh4t7plOXEk1xdbCg45NMqfUX42'

    let queryDate = document.getElementById('queryDate')
    let nasaDate = document.getElementById('nasaDate')
    let nasaTitle = document.getElementById('nasaTitle')
    let nasaImage = document.getElementById('nasaImage')
    let nasaExplanation = document.getElementById('nasaExplanation')

    //  if the user entered a date we will append that to the APOD API
    if (queryDate.value.length > 0) {
        url += '&date=' + queryDate.value;
    }

    //  this is all there is to it
    //      make the request
    fetch(url)
        .then(response => response.json())          //  wait for the response and convert it to JSON
        .then(apod => {                             //  with the resulting JSON data do something
            if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
                document.body.innerText = JSON.stringify(apod);     //  if the box is clicked only show the JSON result
                return;
            }

            //  extract the interesting data from the JSON object and show it to the user
            nasaDate.innerText = apod.date;
            nasaExplanation.innerText = apod.explanation;
            nasaImage.src = apod.url;
            nasaTitle.innerText = apod.title;
        });
}