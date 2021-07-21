let json = document.getElementById('json');

document.getElementById('getMovies').addEventListener('click', getMoviesByTitle);
document.getElementById('getActor').addEventListener('click', getMoviesByActor);
document.getElementById('title').addEventListener('change', clearLocalStorage);


async function getMoviesByTitle() {
    let movieList = document.getElementById('movieList');       //  where we will put our list of matching movies
    let movieTitle = document.getElementById('title');          //  movie title entry field
    document.getElementById('pop').style.display = "none";      // Hide things that are not being used during search
    document.getElementById('bannerContainer').style.display = "none";
    document.getElementById('errorResults').style.display = 'none';
    document.getElementById('errorSpace').style.display = 'none';
    document.getElementById('error').style.display = 'none';

    let cPage = getPage();

    let url = `https://api.themoviedb.org/3/search/movie?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;


    if (movieTitle.value.length < 1) {
        document.getElementById('error').style.display = 'inline';
        document.getElementById('error').innerText = "Please enter a Movie to search for";
        return;
    } else {
        document.getElementById('error').style.display = 'none';
    }

    //  add movie to the search API
    url += movieTitle.value;

    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(movies => {
            if (movies.results.length < 1) {
                document.getElementById('errorResults').style.display = 'block';
                document.getElementById('pagbuttons').style.display = 'none';
                document.getElementById('bannerContainer').style.display = 'none';
                document.getElementById('pop').style.display = 'none';
                return;
            }

            //  display data from the API call
            let innerHTML = "<div class='grid-container'>";

            //  display each movie
            for (let movie of movies.results) {
                //Build a card for each movie
                innerHTML +=
                    `<div class="grid-item" id="${movie.id}" >
                            <h3 class="cardTitle">${movie.title}</h3>`;
                //  if poster is not available, post backup poster
                if (movie.poster_path != null) {
                    innerHTML += `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' height="200px" >`;
                } else {
                    innerHTML += `<img src='./movie.jpg' height="200px" >`;
                }
                innerHTML +=
                    `<h4 class="cardDate">Release Date: ${movie.release_date}</h4>
                    <h4 class="cardRating">Rating ${movie.vote_average}/10</h4>
                    <h5 class="cardDes"><span>Description: </span>${movie.overview}</h5></div>`;
            }
            innerHTML += "</div>";

            //  add HTML and put it into the web page
            movieList.innerHTML = innerHTML;

            //set current page
            setPage(movies.page, movies.total_pages);
            //  add event listeners to each movie
            for (let movie of movies.results) {
                document.getElementById(movie.id).addEventListener('click', movieDetails)
            }
        });


    document.getElementById('searchbar').style.display = 'none';
    document.getElementById('searchPag').style.display = 'grid';
    document.getElementById('pagbuttons').style.display = 'block';
}

function movieDetails() {
    let movieList = document.getElementById('movieList');   //  this is where we will put our movie details
    let url;

    if (this.id) {
        url = `https://api.themoviedb.org/3/movie/${this.id}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&append_to_response=credits`;    //  search for movies with this ID
    } else {
        url = `https://api.themoviedb.org/3/movie/${localStorage.movieId}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&append_to_response=credits`;    //  search for movies with this ID
    }


    //  using the movie details API get additional data about the movie
    fetch(url)
        .then(response => response.json())
        .then(movie => {

            //display movie data
            let innerHTML = "<div class='grid-container'>";
            innerHTML +=
                `<div class="grid-item">
                    <h4>Title: ${movie.title}</h4>
                    <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' height="200px"'>
                    <h4>Release Date: ${movie.release_date}</h4>
                    <h4>Plot: ${movie.overview}</h4>     
                <div id="castContainer">`;
            //  show the actor's name, picture, the character they playe and add a link to IMDB for the actor
            for (let actor of movie.credits.cast) {
                //  make sure the profile picture is available, if not they probably won't be missed
                if (actor.profile_path) {
                    innerHTML +=
                        `<div class="actorItem" id=${actor.id}>
                            <div>Name: ${actor.name} </div>
<!--                             <a href="https://api.themoviedb.org/3/person/${actor.id}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US">-->
<!--                             <a href="https://www.imdb.com/name/${actor.imdb_id}">-->
                                <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" height="120px" alt="cast pic">
                                <div>as ${actor.character}</div>
<!--                            </a>-->

                    </div>`
                }
            }
            innerHTML += "</div></div></div>";
            movieList.innerHTML = innerHTML

            let actorArray = document.getElementsByClassName('actorItem')
            for (let actor of actorArray) {
                document.getElementById(actor.id).addEventListener('click', actorDetails)
            }
            //save movie id to local storage
            localStorage.movieId = movie.id;
        });
    // document.getElementById('pagbuttons').style.display = 'none';
    document.getElementById('searchPag').style.display = 'grid';
    document.getElementById('searchButton').style.display = 'grid';
    document.getElementById('back2Movie').style.display = 'none';
    document.getElementById('pagbuttons').style.display = 'none';
    document.getElementById('back2Movie').style.display = 'none';

}

async function getMoviesByActor() {
    let movieList = document.getElementById('movieList');       //  where we will put our list of matching movies
    let movieTitle = document.getElementById('title');          //  movie title entry field

    //Make sure no errors are showing
    document.getElementById('errorResults').style.display = 'none';
    document.getElementById('errorSpace').style.display = 'none';
    document.getElementById('error').style.display = 'none';

    let cPage = getPage();

    let url = `https://api.themoviedb.org/3/search/person?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;

    //  no movie? no search
    if (movieTitle.value.length == 0) {
        document.getElementById('error').innerText = "Please enter an Actor to search for";
        document.getElementById('error').style.display = 'inline';
        return;
    } else {
        document.getElementById('error').style.display = 'none';
    }

    //  add movie to the search API
    url += movieTitle.value;
    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(actors => {

            //  display data from the API call
            let innerHTML = "<div class='grid-container'>";

            if (actors.results.length < 1) {
                console.log("NO RESULTS")
                document.getElementById('errorResults').style.display = 'block';
                document.getElementById('pagbuttons').style.display = 'none';
                document.getElementById('bannerContainer').style.display = 'none';
                document.getElementById('pop').style.display = 'none';
                return;
            }

            let actorMovieList = actors.results[0].known_for;


            //  display each movie
            for (let movie of actorMovieList) {
                //Build a card for each movie
                innerHTML +=
                    `<div class="grid-item" id="${movie.id}">
                            <h3>${movie.title}</h3>`;
                //if poster is not available, post backup poster
                if (movie.poster_path != null) {
                    innerHTML += `<img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' height="200px" >`;
                } else {
                    innerHTML += `<img src='./movie.jpg' height="200px" >`;
                }
                innerHTML +=
                    `<h4>Release Date: ${movie.release_date}</h4>
                    <h4>Rating ${movie.vote_average}/10</h4>
                    <h5>Description: ${movie.overview}</h5></div>`;
            }
            innerHTML += "</div>";

            //  add HTML and put it into the web page
            movieList.innerHTML = innerHTML;

            //  Display the actor searched for at the top of results
            displayActorName(actors.results[0].name, `https://image.tmdb.org/t/p/w500${actors.results[0].profile_path}`);
        });

}

function setPage(currentPage, numPages) {
    let myStorage = window.localStorage;

    let page = Number(currentPage);
    localStorage.page = JSON.stringify(page);
    myStorage.setItem('total_pages', numPages)
    if (page === numPages) {
        document.getElementById('next').disabled = true;
    } else {
        document.getElementById('next').disabled = false;
    }
}

function getPage() {
    if (localStorage.page > 1) {
        document.getElementById('prev').disabled = false;
        return Number(localStorage.page);
    } else {
        document.getElementById('prev').disabled = true;
        document.getElementById('next').disabled = false;
        return 1;
    }
}

function clearLocalStorage() {
    localStorage.removeItem("page");
    localStorage.removeItem("total_pages");
}

async function getPrev() {
    let page = localStorage.page;
    page = page - 1;
    localStorage.page = page;
    await getMoviesByTitle();
}

async function getNext() {
    let page = Number(localStorage.page);
    page++;
    localStorage.page = page;
    await getMoviesByTitle();
}

function searchAgain() {
    document.getElementById('searchPag').style.display = 'none';
    document.getElementById('searchbar').style.display = 'grid';
    document.getElementById('title').value = "";
    document.getElementById('movieList').innerHTML = "";
    document.getElementById('pop').style.display = 'block';
    document.getElementById('bannerText').style.display = 'block';
    document.getElementById('bannerText').innerText = "Search again!!!!";
    document.getElementById('back2Movie').style.display = "none";
}

function displayActorName(name, pic) {
    document.getElementById('searchPag').style.display = 'none';
    document.getElementById('searchbar').style.display = 'none';
    document.getElementById('pop').style.display = 'none';
    document.getElementById('bannerContainer').style.display = "none";
    document.getElementById('back2Movie').style.display = "none";
    document.getElementById('actorBanner').style.display = 'grid';

    let display = document.getElementById('actorBanner');

    let innerHTML = "<div class='topRow'>";

    innerHTML += `<button onclick="hideActorBanner()" id="buttonPad">Search Again</button></div>
                <div class="grid-item actorbox"><h3> Movie featuring ${name} </h3>
                    <img id="actorImage" src=${pic} height="200px">
                </div>`;

    display.innerHTML = innerHTML;
}

function hideActorBanner() {
    document.getElementById('actorBanner').style.display = 'none';
    searchAgain();
}

function actorDetails() {
    let movieList = document.getElementById('movieList');   //  this is where we will put our movie details

    let url = `https://api.themoviedb.org/3/person/${this.id}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US`;    //  search for movies with this ID

    fetch(url)
        .then(response => response.json())
        .then(actor => {

            if (actor.gender == '1') {
                actor.gender = 'Female';
            } else if (actor.gender == '2') {
                actor.gender = 'Male';
            }

            //display movie data
            let innerHTML = "<div id='actorGridItem' class='grid-container'>";
            innerHTML +=
                `<div  class="grid-item">
                    <h2>Name: ${actor.name}</h2>
                    <img src='https://image.tmdb.org/t/p/w500${actor.profile_path}' height="200px" >
                    <h3>Birthday: ${actor.birthday}</h3>
                    <h3>Birthplace: ${actor.place_of_birth}</h3>
                    <h3>Gender: ${actor.gender}</h3>
                    <h3>Popularity: ${actor.popularity}/10</h3>
                    <h3>Also known as: ${actor.also_known_as}</h3>
                    <h3 id="bio">Biography: </h3>
                    <div id="bio">${actor.biography}</div><br>
                    <a href="https://www.imdb.com/name/${actor.imdb_id}"><button id="imdb">Go to IMDB Bio</button></a>`

            innerHTML += "</div></div>";
            movieList.innerHTML = innerHTML
        });
    document.getElementById('searchButton').style.display = 'none';

    let buttonHTML = "<button onclick='movieDetails()'>Back to movie details</button>";
    // let banner = document.getElementById('back2Movie');
    let banner = document.getElementById('back');

    banner.innerHTML = buttonHTML;

    document.getElementById('back2Movie').style.display = 'grid';
    document.getElementById('actorBanner').style.display = 'none';
    document.getElementById('pagbuttons').style.display = 'none';

}



