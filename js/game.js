let canvas;
let ctx;
let world = new World();

function init(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2D');

    console.log('My character is', world.character);
    
}