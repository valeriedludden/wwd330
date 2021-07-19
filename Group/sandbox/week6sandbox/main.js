import Hikes from "./hikes.js";
//on load grab the array and insert it into the page
const myHikes = new Hikes("hikes");
window.addEventListener("load", () => {
    myHikes.showHikeList();
});
myHikes.hikeList;

const numbers = [ 1, 2, 3, 4, 5 ];
// Don't do this
const flattened1 = numbers.map( number => [number, number * 2])

console.log(flattened1)
// Do this instead
const flattened2 = numbers.flatMap( number => [number, number * 2]);
console.log(flattened2)