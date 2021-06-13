
function square(x){
    square.cache = square.cache || {};
    if (!square.cache[x]) {
        square.cache[x] = x*x;
    }
    console.log(square.cache)
    return square.cache[x]
}

function minusOne(x){
    minusOne.cache = minusOne.cache || {};
    if(!minusOne.cache[x]){
        minusOne.cache[x] = (x * x)-1;
    }
    console.log(minusOne.cache);
    return minusOne.cache;
}
//IIFE (pronounced "iffY) Invoked as soon as defined.
(function(){
    const temp = 'World';
    console.log(`Hello ${temp}`);
})();
(function() {
    const name = 'Peter Parker'; // This might be obtained from a cookie in reality
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday', 'Friday','Saturday'];
    const date = new Date(), today = days[date.getDay()];
    console.log(`Welcome back ${name}. Today is ${today}`);
})();
