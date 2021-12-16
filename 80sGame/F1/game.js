var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp":
            wDown = true;
            break;
        case "s": case "ArrowDown":
            sDown = true;
            break;
        case "a": case "ArrowLeft":
            aDown = true;
            break;
        case "d": case "ArrowRight":
            dDown = true;
            break;
        case "q": case "1": qDown = true; break;
        case "e": case "2": eDown = true; break;
        case "r": case "3": rDown = true; break;
        case "z":
            reset();
            break;
    }
    inputMode = "key";
}
function keyUpHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp": wDown = false; break;
        case "s": case "ArrowDown": sDown = false; break;
        case "a": case "ArrowLeft": aDown = false; break;
        case "d": case "ArrowRight": dDown = false; break;
    }
}

function radToDeg(rad) {
    return rad * 180 / Math.PI;
}
function degToRad(deg) {
    return deg * Math.PI / 180;
}

function drawAll() {
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // temp.draw();
    // temp2.draw();

    car.move();
    car.draw();

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

    // Set up the context for the animation
    context = canvas.getContext("2d");
    return context;
}

var context = setUpContext();

// var temp = new Vector(-100, 50);
// console.log(temp.getAngle());
// var temp2 = new Vector(-100, 50);
// temp2.setAngle(-45);

var car = new Car(new Vector(50, 50), 30);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);