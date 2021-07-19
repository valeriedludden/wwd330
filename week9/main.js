const squareElement = document.getElementById('square');
let angle = 0;
setInterval( () => {
    angle = (angle + 2) % 360;
    squareElement.style.transform = `rotate(${angle}deg)`
}, 1000/60);

//Makes block 2 spin
const squareElement2 = document.getElementById('square2');
let angle2 = 0;
function rotate() {
    angle2 = (angle2 + 2)%360;
    squareElement2.style.transform = `rotate(${angle2}deg)`
    window.requestAnimationFrame(rotate);
}
const id = requestAnimationFrame(rotate);

function stop(){
    cancelAnimationFrame(id);
}
