
async function getMovies() {
    let response = await MAPI();

       console.log("response => " +JSON.stringify(response));

}
function MAPI() {
    //    console.log("in SWAPI");
    return fetch("https://imdb8.p.rapidapi.com/title/find?q=love", {
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "2f693630c5msh9435ca22cad0397p15d02ajsna5d33e9c6596",
            "x-rapidapi-host": "imdb8.p.rapidapi.com"
        }
    })
        .then(response => {
            console.log("JSON ", JSON.stringify(response));
            console.log(JSON.stringify(response));
        })
        .catch(err => {
            console.error(err);
        });

}