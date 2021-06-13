const peopleButton = document.getElementById('people');
const morePeopleButton = document.getElementById('more');
const outputDiv = document.getElementById('output');

const swPeopleURL = "https://swapi.dev/api/people";
const moreswPeopleURL = "https://swapi.dev/api/people/?page=2";

peopleButton.addEventListener('click', () => {
    fetch(swPeopleURL)
        .then( response => {
            outputDiv.innerHTML = 'Waiting for response...';
            if(response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then( response => response.json() )
        .then( data => {
            outputDiv.innerText = data.results[0].name;
            // data.results.forEach(result, index =>
            for(let i = 0; i < data.results.length; i++){
                console.log(`The persons name is  ${data.results[i].name}`)
            }
        }).catch( error => console.log('There was an error:', error))
},false);

morePeopleButton.addEventListener('click', () => {
    fetch(moreswPeopleURL)
        .then( response => {
            outputDiv.innerHTML = 'Waiting for response...';
            if(response.ok) {
                return response;
            }
            throw Error(response.statusText);
        })
        .then( response => response.json() )
        .then( data => {
            outputDiv.innerText = data.results[0].url;
            // data.results.forEach(result, index =>
            for(let i = 0; i < data.results.length; i++){
                console.log(`The persons name is  ${data.results[i].name}`)
            }
        }).catch( error => console.log('There was an error:', error))
},false);