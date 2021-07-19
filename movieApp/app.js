let json = document.getElementById('json');

document.getElementById('getMovies').addEventListener('click', getMoviesByTitle);
document.getElementById('getActor').addEventListener('click', getMoviesByActor);
document.getElementById('title').addEventListener('change', clearLocalStorage);


async function getMoviesByTitle() {
    let movieList = document.getElementById('movieList');       //  where we will put our list of matching movies
    let movieTitle = document.getElementById('title');          //  movie title entry field

    let cPage = getPage();
    // let url;
    //
    // if(localStorage.searchType === 'movie'){
    //    url = `https://api.themoviedb.org/3/search/movie?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;
    // }
    // else if(localStorage.searchType === 'actor'){
    //     url = `https://api.themoviedb.org/3/search/person?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;
    // }
    // else{
    // }

    let url = `https://api.themoviedb.org/3/search/movie?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;

    //  no movie? no search
    if (movieTitle.value.length == 0) {
        movieList.innerText = "Enter a Movie to search for"
        return;
    }

    //  add movie to the search API
    url += movieTitle.value;

    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(movies => {
            // if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
            //     document.body.innerText = JSON.stringify(movies);       //  if the box is clicked only show the JSON result
            //     return;
            // }

            //display data from the API call
            let innerHTML = "<div class='grid-container'>";

            //display each movie
            for (let movie of movies.results) {
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

            //set current page
            setPage(movies.page, movies.total_pages);
           //add event listeners to each movie
            for (let movie of movies.results) {
                document.getElementById(movie.id).addEventListener('click', movieDetails)
            }
        });
    document.getElementById('pag').style.visibility = "visible";
    document.getElementById('pop').style.display = "none";
}

function movieDetails() {
    let movieList = document.getElementById('movieList');   //  this is where we will put our movie details

    let url = `https://api.themoviedb.org/3/movie/${this.id}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&append_to_response=credits`;    //  search for movies with this ID

    //  using the movie details API get additional data about the movie
    fetch(url)
        .then(response => response.json())
        .then(movie => {
            //todo remove
            // if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
            //     document.body.innerText = JSON.stringify(movie);       //  if the box is clicked only show the JSON result
            //     return;
            // }

            //display movie data
            let innerHTML = "<div class='grid-container'>";
            innerHTML +=
                `<div class="grid-item">
                    <h4>Description: ${movie.title}</h4>
                    <h4>Release Date: ${movie.release_date}</h4>
                    <h4>Plot: ${movie.plot}</h4>
                    <img src='https://image.tmdb.org/t/p/w500${movie.poster_path}' height="200px"'>
                <ul>`;
             //show the actor's name, picture, the character they playe and add a link to IMDB for the actor
            for (let actor of movie.credits.cast) {
                //make sure the profile picture is available
                if (actor.profile_path) {
                    innerHTML +=
                        `<li>

                         <a href="https://api.themoviedb.org/3/person/${actor.id}?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US">
                            <img src="https://image.tmdb.org/t/p/w500${actor.profile_path}" height="120px" alt="cast pic">
                            Name: ${actor.name} as ${actor.character}
                        </a>

                    </li>`
                }
                //if it is not available, then just have the name, but no link
                else {
                    innerHTML +=
                        `<li>
                        Name: ${actor.name} as ${actor.character}*****
                    </li>`
                }

            }
            innerHTML += "</ul></div></div>";
            movieList.innerHTML = innerHTML
        });
}
async function getMoviesByActor() {
    let movieList = document.getElementById('movieList');       //  where we will put our list of matching movies
    let movieTitle = document.getElementById('title');          //  movie title entry field

    let cPage = getPage();

    let url = `https://api.themoviedb.org/3/search/person?api_key=c020705df560da1c41cd5f215a4cd961&language=en-US&page=1&include_adult=false&page=${cPage}&query=`;

    //  no movie? no search
    if (movieTitle.value.length == 0) {
        movieList.innerText = "Enter a Movie to search for"
        return;
    }

    //  add movie to the search API
    url += movieTitle.value;
    //  make the request
    fetch(url)
        .then(response => response.json())
        .then(actors => {
            //todo remove
            if (json.checked) {                     //  there is a checkbox at the top of the page for JSON only
                document.body.innerText = JSON.stringify(actors);       //  if the box is clicked only show the JSON result
                return;
            }

            //display data from the API call
            let innerHTML = "<div class='grid-container'>";
            let actorMovieList = actors.results[0].known_for;
            //display each movie
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


            //add event listeners to each movie
            for (let movie of actorMovieList) {
                document.getElementById(movie.id).addEventListener('click', movieDetails)
            }
        });
    document.getElementById('pag').style.visibility = "visible";
    document.getElementById('pop').style.display = "none";
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
        // let page = Number(JSON.parse(localStorage.page))
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

function setURLType(){
    let ele = document.getElementsByName('searchType');
    for(i = 0; i < ele.length; i++) {
        if(ele[i].checked){
            localStorage.searchType = ele[i].value;
        }

    }
}




