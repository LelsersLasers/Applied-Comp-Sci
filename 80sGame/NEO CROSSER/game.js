var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var lastDir = "s";

var qDown = false;
var eDown = false;
var rDown = false;

var inputMode = "either";
var mouseDown = false;
var mousePos = new Vector(-1, -1);
var cursorHB = new HitBox(-1, -1, 0, 0);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("click", clickHandler, false);
document.addEventListener("mousemove", getMousePos, false);

function keyDownHandler(e) {
    switch (e.key) {
        case "w": case "ArrowUp":
            if (screen == "restore") {
                selectedIndex -= 1;
                deleteCount = 0;
            }
            wDown = true;
            lastDir = "w";
            break;
        case "s": case "ArrowDown":
            if (screen == "welcome") screen = "scores";
            else if (screen == "restore") {
                selectedIndex += 1;
                deleteCount = 0;
            }
            else if (paused) {
                save();
                saveButton.clicked = 10;
            }
            sDown = true;
            lastDir = "s";
            break;
        case "a": case "ArrowLeft":
            aDown = true;
            lastDir = "a";
            break;
        case "d": case "ArrowRight":
            if (screen == "welcome") screen = "directions";
            dDown = true;
            lastDir = "d";
            break;
        case "q": case "1":
            if (paused) {
                reset();
            }
            qDown = true;
            break;
        case "e": case "2": eDown = true; break;
        case "r": case "3":
            if (paused) paused = false;
            rDown = true;
            break;
        case "z": case "Escape":
            if (screen == "game") paused = !paused;
            break;
        case "p":
            if (screen == "play") screen = "restore";
            break;
        case "m":
            if (paused) musicToggle();
            break;
        case "g":
            if (screen == "play") {
                screen = "game";
                musicStart();
            }
            break;
        case "x":
            if (screen == "restore") {
                let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                if (games != []) games.splice(selectedIndex, 1);
                localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
            }
            break;
        case "y":
            if (screen == "restore") {
                let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                if (games != []) {
                    restore(games[selectedIndex]);
                    screen = "game";
                }
            }
            break;
        case "Enter":
            if (screen == "welcome") {
                screen = "play";
            }
            else if (screen == "play") screen = "welcome";
            else if (screen == "restore") {
                screen = "play";
            }
            else if (screen == "game" && !alive) {
                reset();
            }
            else if (screen == "directions" || screen == "scores") {
                screen = "welcome";
            }
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
        case "q": case "1": qDown = false; break;
        case "e": case "2": eDown = false; break;
        case "r": case "3": rDown = false; break;
    }
}
function clickHandler(event) {
    if (screen == "welcome") {
        if (cursorHB.checkCollide(directionsButton.hb)) {
            screen = "directions";
        }
        else if (cursorHB.checkCollide(scoresButton.hb)) {
            screen = "scores";
        }
        else {
            screen = "play";
        }
    }
    else if (screen == "play") {
        if (cursorHB.checkCollide(previousGameButton.hb)) {
            screen = "restore";
        }
        else if (cursorHB.checkCollide(newGameButton.hb)) {
            screen = "game";
            musicStart();
        }
        else screen = "welcome";
    }
    else if (screen == "restore") {
        let buttonHit = false;
        for (var i = 0; i < restoreButtons.length; i++) {
            if (cursorHB.checkCollide(restoreButtons[i].hb)) {
                if (i == selectedIndex) {
                    let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                    restore(games[selectedIndex]);
                    screen = "game";
                }
                selectedIndex = i;
                deleteCount = 0;
                buttonHit = true;
            }
        }
        if (!buttonHit) screen = "play";
    }
    else if (screen == "game" && !alive) {
        reset();
    }
    else if (screen == "game") {
        if (cursorHB.checkCollide(pauseButton.hb)) paused = !paused;
        else if (paused) {
            if (cursorHB.checkCollide(resumeButton.hb)) {
                paused = false;
            }
            else if (cursorHB.checkCollide(saveButton.hb)) {
                save();
                saveButton.clicked = 10;
            }
            else if (cursorHB.checkCollide(quitButton.hb)) {
                reset();
            }
            else if (cursorHB.checkCollide(musicButton.hb)) {
                musicToggle();
            }
        }
    }
    else if (screen == "directions" || screen == "scores") {
        screen = "welcome";
    }
}
function getMousePos(event) {
    var rect = canvas.getBoundingClientRect();
    mousePos.x = event.clientX - rect.left;
    mousePos.y = event.clientY - rect.top;
    cursorHB = new HitBox(new Vector(mousePos.x - 6, mousePos.y - 6), 10, 10);
}

function mouseDownActions() {
    if (screen == "game") {
        if (inputMode != "key") {
            wDown = wTrigger.checkDown(cursorHB, mouseDown);
            sDown = sTrigger.checkDown(cursorHB, mouseDown);
            aDown = aTrigger.checkDown(cursorHB, mouseDown);
            dDown = dTrigger.checkDown(cursorHB, mouseDown);
            qDown = qAbility.checkDown(cursorHB, mouseDown);
            eDown = eAbility.checkDown(cursorHB, mouseDown);
            rDown = rAbility.checkDown(cursorHB, mouseDown);
            if (wDown) lastDir = "w";
            if (sDown) lastDir = "s";
            if (aDown) lastDir = "a";
            if (dDown) lastDir = "d";
        }
    }
    else if (screen == "restore") {
        for (var i = 0; i < restoreButtons.length; i++) {
            if (cursorHB.checkCollide(restoreButtons[i].hb) && i == selectedIndex) {
                deleteCount++;
                console.log(deleteCount);
                if (deleteCount > 30) {
                    let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
                    games.splice(selectedIndex, 1);
                    localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
                    deleteCount = 0;
                }
            }
        }
    }
}

function reset() {
    writeScore();
    location.reload(); // reloads the webpage
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    value = Math.floor(Math.random() * (max - min) + min); //The max is exclusive and the min is inclusive
    return value;
}

function musicStart() {
    backgroundMusic.currentTime = getRandomInt(20, backgroundMusic.duration);
    if (musicShouldPlay === "true") {
        backgroundMusic.play();
        backgroundMusic.playing = true;
    }
}
function musicToggle() {
    if (backgroundMusic.playing) {
        backgroundMusic.pause();
        backgroundMusic.playing = false;
    }
    else {
        backgroundMusic.play();
        backgroundMusic.playing = true;
    }
    musicButton.clicked = 10;
    localStorage.setItem("playMusic", backgroundMusic.playing);
}

function getName(message) {
    let name = localStorage.getItem("name") != null ? localStorage.getItem("name") : "";
    name = prompt(message, name);
    if (name == null) name = "N/A";
    localStorage.setItem("name", name);
    name += "   "; // incase they entered less than 3 characters, backfill with spaces
    name = name.substring(0, 3).toUpperCase()
    return name;
}

function writeScore() {
    localStorage.setItem("lastScore", topScore);
    let scores = getTopScores();
    let scoresNew = [];
    let swap = 0;
    for (let i = 0; i < scores.length; i++) {
        scoresNew.push(scores[i - swap]);
        if (topScore > parseInt(scores[i].substring(5)) && swap == 0) { // 3 lettes + ':' + ' ' = 5
            let name = getName("Congrats on a Top 10 Score! (Rank " + (i + 1) + "!) Enter 3 letters for your name on the score board:");
            swap = 1;
            scoresNew[i] = name + ": " + topScore;
        }
    }
    localStorage.setItem("NEO CROSSER - Leader Board", scoresNew);
}

function getTopScores() {
    let scoresTxt = localStorage.getItem("NEO CROSSER - Leader Board");
    let scores = [];
    if (scoresTxt == null) { // no scores variable in localStorage -> fill with blank values
        for (let i = 0; i < 10; i++) scores.push("N/A: -1");
        localStorage.setItem("NEO CROSSER - Leader Board", scores.toString()); // create the variable b/c it doesn't exist
    }
    else scores = scoresTxt.split(",");
    return scores;
}

function save() {
    let date = new Date();
    let name = getName("Enter 3 letters for your name to save:");
    name += ": " + topScore + " " + date.getHours() + ":" + date.getMinutes() + "-" + (date.getMonth() + 1) + "/" + date.getDate();
    
    let gameSave = {
        "name": name,
        "player": player,
        "cars": cars,
        "buildings": buildings,
        "lasers": lasers,
        "bar": bar,
        "ufos": ufos,
        "score": score,
        "topScore": topScore,
        "topScore": topScore,
        "qAbility": qAbility,
        "eAbility": eAbility,
        "rAbility": rAbility,
        "alive": alive,
    };

    let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    games.push(gameSave);
    localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
}

function restore(savedGame) {
    player.restore(savedGame.player);

    cars = [];
    for (let i = 0; i < savedGame.cars.length; i++) {
        cars.push(new Car(-1, -1));
        cars[i].restore(savedGame.cars[i]);
    }

    buildings = [];
    for (let i = 0; i < savedGame.buildings.length; i++) {
        buildings.push(new Building(-1));
        buildings[i].restore(savedGame.buildings[i]);
    }

    lasers = [];
    for (let i = 0; i < savedGame.lasers.length; i++) {
        lasers.push(new Laser(new Vector(-1, -1), "s", -1));
        lasers[i].restore(savedGame.lasers[i]);
    }

    bar = [];
    for (let i = 0; i < savedGame.bar.length; i++) {
        bar.push(new Block(new Vector(-1, -1), -1, -1, -1));
        bar[i].restore(savedGame.bar[i]);
    }

    ufos = [];
    for (let i = 0; i < savedGame.ufos.length; i++) {
        ufos.push(new Ufo(-1));
        ufos[i].restore(savedGame.ufos[i]);
    }

    qAbility.restore(savedGame.qAbility);
    eAbility.restore(savedGame.eAbility);
    rAbility.restore(savedGame.rAbility);

    score = savedGame.score;
    topScore = savedGame.topScore;
    alive = savedGame.alive;

    pause = true;
}

function buttonHover() {
    if (screen == "welcome") {
        if (cursorHB.checkCollide(directionsButton.hb)) directionsButton.clicked = 1;
        else if (cursorHB.checkCollide(scoresButton.hb)) scoresButton.clicked = 1;
    }
    else if (screen == "play") {
        if (cursorHB.checkCollide(previousGameButton.hb)) previousGameButton.clicked = 1;
        else if (cursorHB.checkCollide(newGameButton.hb)) newGameButton.clicked = 1;
    }
    else if (paused) {
        if (cursorHB.checkCollide(resumeButton.hb)) resumeButton.clicked = 1;
        else if (cursorHB.checkCollide(saveButton.hb)) saveButton.clicked = 1;
        else if (cursorHB.checkCollide(quitButton.hb)) quitButton.clicked = 1;
        else if (cursorHB.checkCollide(musicButton.hb)) musicButton.clicked = 1;
    }
}

function drawWelcome() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    context.fillText("NEO CROSSER", canvas.width/2, canvas.height * 1/3);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Start", canvas.width/2, canvas.height * 1/3 + carHeight);

    directionsButton.draw();
    scoresButton.draw();
}

function drawPlayMenu() {
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width/2, canvas.height * 1/4 + carHeight);

    previousGameButton.draw();
    newGameButton.draw();
}

function drawRestoreMenu() {
    let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    restoreButtons = []

    if (selectedIndex > games.length - 1) {
        selectedIndex = games.length - 1;
        deleteCount = 0;
    }
    else if (selectedIndex < 0) {
        selectedIndex = 0;
        deleteCount = 0;
    }

    for (var i = 0; i < games.length; i++) {
        let y = canvas.height/2 - (carHeight * 3/4 + 20) * 1/2 - 10 + (i - selectedIndex) * (carHeight * 3/4 + 40);
        let button = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, y), pauseWidth, carHeight * 3/4 + 20, games[i].name, carHeight * 1/2);
        restoreButtons.push(button);
        if (i == selectedIndex) {
            restoreButtons[i].clicked = 1;
        }
        restoreButtons[i].draw();
    }

    context.font = carHeight * 3/4 + "px " + font;
    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height * 1/4 - carHeight/4);
    context.fillStyle = "#ffffff";
    context.fillText("Press X to Delete, Press Y to Resume", canvas.width/2, canvas.height * 1/4 - carHeight * 1.8);

    context.font = carHeight/2 + "px " + font;
    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.fillText("Touch to Go Back", canvas.width/2, canvas.height * 1/4 - carHeight);

    if (mouseDown) {
        mouseDownActions();
    }
}

function drawDirections() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    let base = canvas.height * 1/4;
    context.fillText("Directions", canvas.width/2, base);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width/2, base + carHeight);

    var txts = [];
    txts.push("Use 'wasd' to move. Don't get hit by cars.");
    txts.push("(You can also touch the w/a/s/d buttons in the bottom right.)")
    txts.push("Also you can't run through the buildings.");
    txts.push("Cars also can't go through the buildings.");
    txts.push("You also have 3 abilities:");
    txts.push("Q which teleports a short distance,");
    txts.push("E which fires a laser that causes a small stun, and");
    txts.push("R which fires a laser in every direction.");
    txts.push("(Abilites can be actived with their respective key,");
    txts.push("or by tapping the icon in the bottom left.)")
    txts.push("Goal: Go as far up as possible.")
    txts.push("Touch button in top right (or press Esc) to show the pause menu.")
    txts.push("From the pause menu you can toggle the music, save, or quit.")

    context.fillStyle = "#ffffff";
    context.font = carHeight * 5/12 + "px  " + font;
    for (var i = 0; i < txts.length; i++) {
        context.fillText(txts[i], canvas.width/2, base + carHeight + carHeight * 1/2 * (3+i));
    }
}

function drawScores() {
    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    let base = canvas.height * 1/4;
    context.fillText("Top Scores", canvas.width/2, base);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Go Back", canvas.width/2, base + carHeight);
 
    context.font = carHeight * 5/12 + "px " + font;
    let scores = getTopScores();
    let txts = [];
    let maxWidth = 0;
    for (let i = 0; i < scores.length; i++) {
        let line = (i + 1) + ") ";
        if (i < 9) line = " " + line; // adjust for 2 digit nums
        if (parseInt(scores[i].substring(5)) > 0) line += scores[i];
        else line += "N/A: 0" // no player set 
        line = line.toUpperCase() // in case name was set before uppercase was enforced // TODO, on reset leader board remove this line
        let width = context.measureText(line).width;
        if (width > maxWidth) maxWidth = width; // aline by longest line
        txts.push(line);
    }
    context.textAlign = "left";
    for (let i = 0; i < txts.length; i++) {
        if (i == 0)      context.fillStyle = "rgba(255, 215, 0, 1)"; // gold
        else if (i == 1) context.fillStyle = "rgba(192, 192, 192, 1)"; // silver
        else if (i == 2) context.fillStyle = "rgba(205, 127, 50, 1)"; // bronze
        else             context.fillStyle = "rgba(255, 255, 255, " + (1 - i/10 + 0.2) + ")"; // white
        context.fillText(txts[i], canvas.width/2 - maxWidth/2, base + carHeight + carHeight * 1/2 * (3+i));
    }
    context.textAlign = "center";
}

function drawGameOver() {
    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.textBaseline = "bottom";

    context.fillStyle = "#ffffff";
    context.font = carHeight + "px " + font;
    context.fillText("Game Over", canvas.width/2, canvas.height/2);

    context.fillStyle = "rgba(255,255,255," + textOpacity + ")";
    context.font = carHeight/2 + "px " + font;
    context.fillText("Touch to Exit", canvas.width/2, canvas.height/2 + carHeight);

    context.textBaseline = "middle";
}

function drawPauseMenu() {
    player.draw();
    obstacles = [...cars, ...ufos, ...buildings, ...lasers];
    for (var i in obstacles) obstacles[i].draw();

    drawHUD();

    context.fillStyle = "rgba(0, 0, 0, 0.7)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    resumeButton.draw();
    saveButton.draw();
    quitButton.draw();
    musicButton.draw();
}

function drawHUD() {
    wTrigger.draw(wDown);
    sTrigger.draw(sDown);
    aTrigger.draw(aDown);
    dTrigger.draw(dDown);
    qAbility.draw();
    eAbility.draw();
    rAbility.draw();
    scoreView.setTxt("Score: " + topScore);
    scoreView.draw();
    pauseButton.draw();
}

function drawGame() {
    for (var i in bar) bar[i].draw();
    if (!paused) {
        mouseDownActions();
        player.move();
        player.draw();
        for (var i in buildings) buildings[i].draw();
        enemies = [...cars, ...ufos];
        for (var i in enemies) {
            enemies[i].update();
            enemies[i].draw();
            if (enemies[i].hb.checkCollide(player.hb) && alive) {
                scoreView.color = "#e37e7b";
                enemies[i].deathSound.play();
                alive = false;
                player.off();
            }
        }
        for (var i in lasers) lasers[i].update();
        
        drawHUD();

        if (!alive) {
            drawGameOver();
        }
    }
    else {
        drawPauseMenu();
    }

    if (backgroundMusic.currentTime > backgroundMusic.duration - 20) backgroundMusic.currentTime = 20;
}

function drawAll() {
    buttonHover();

    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    if (screen == "welcome") drawWelcome();
    else if (screen == "play") drawPlayMenu();
    else if (screen == "restore") drawRestoreMenu();
    else if (screen == "game") drawGame();
    else if (screen == "directions") drawDirections();
    else if (screen == "scores") drawScores();

    if (textOpacity > 1) opacityDir = -0.04;
    else if (textOpacity < 0) opacityDir = 0.04;
    textOpacity += opacityDir;

    window.requestAnimationFrame(drawAll);
}

function setUpContext() {
    // Get width/height of the browser window
    console.log("Window is %d by %d", window.innerWidth, window.innerHeight);
    // Get the canvas, set the width and height from the window
    canvas = document.getElementById("mainCanvas");
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 20;

    canvas.onmousedown = function(event) {
        mouseDown = true;
    }
    canvas.onmouseup = function(event) {
        mouseDown = false;
    }

    // Set up the context for the animation
    context = canvas.getContext("2d");

    context.textAlign = "center";
    context.textBaseline = "middle";
    context.lineWidth = 3;

    return context;
}

// localStorage.removeItem("NEO CROSSER - Leader Board"); // reset leard board

var font = "monospace";

var screen = "welcome";
var paused = false;

var alive = true;
var score = 0;
var topScore = 0;

const moveWait = 30;

var textOpacity = 1;
var opacityDir = -0.04;

const soundOffset = 10.0;
// Set up the canvas, context objects, and html elements
var context = setUpContext();

var qSound = document.createElement("audio");
qSound.src = "qSound.mp3";
qSound.volume = 1.0/soundOffset;
var eSound = document.createElement("audio");
eSound.src = "eSound.mp3"; // x2
eSound.volume = 3.5/soundOffset;
var rSound = document.createElement("audio");
rSound.src = "rSound.mp3";
rSound.volume = 1.0/soundOffset;

var backgroundMusic = document.createElement("audio");
backgroundMusic.src = "backgroundMusic.mp3";
backgroundMusic.playing = false;
backgroundMusic.volume = 0.9/soundOffset;
var musicShouldPlay = localStorage.getItem("playMusic") != null ? localStorage.getItem("playMusic") : "true";

var texPlayer = new Image();
texPlayer.src = "player-10x11-4x8-1spacing.png";
var posSourcePlayer = [ // [!alive][dir][animationPlayer][x/y]
    [
        [[0, 0], [11, 0], [22, 0], [33, 0]], // down
        [[0, 12], [11, 12], [22, 12], [33, 12]], // up
        [[0, 24], [11, 24], [22, 24], [33, 24]], // right
        [[0, 36], [11, 36], [22, 36], [33, 36]] // left
    ],
    [
        [[0, 48], [11, 48], [22, 48], [33, 48]], // down
        [[0, 60], [11, 60], [22, 60], [33, 60]], // up
        [[0, 72], [11, 72], [22, 72], [33, 72]], // right
        [[0, 84], [11, 84], [22, 84], [33, 84]] // left
    ]
];

var texCar = new Image();
texCar.src = "car-34x17-2x4-1spacing.png";
var posSourceCar = [ // [active][dir][animation][x/y]
    [ // if active
        [ // if dir == right
            [0, 0], // animation 1
            [35, 0] // animation 2
        ],
        [ // if dir == left
            [0, 18], // animation 1
            [35, 18] // animation 2
        ]
    ],
    [ // if not active
        [ // if dir == right
            [0, 36], // animation 1
            [35, 36] // animation 2
        ],
        [ // if dir == left
            [0, 54], // animation 1
            [35, 54] // animation 2
        ]
    ],
];

var texBus = new Image();
texBus.src = "bus-35x17-2x4-1spacing.png";
var posSourceBus = [ // [active][dir][animation][x/y]
    [ // if active
        [ // if dir == right
            [0, 0], // animation 1
            [36, 0] // animation 2
        ],
        [ // if dir == left
            [0, 18], // animation 1
            [36, 18] // animation 2
        ]
    ],
    [ // if not active
        [ // if dir == right
            [0, 36], // animation 1
            [36, 36] // animation 2
        ],
        [ // if dir == left
            [0, 54], // animation 1
            [36, 54] // animation 2
        ]
    ],
];

var texUfo = new Image();
texUfo.src = "ufo-20x19-2x2-1spacing.png";
var posSourceUfo = [
    [
        [0, 0],
        [21, 0]
    ],
    [
        [0, 20],
        [21, 20]
    ]
];

var texBar = new Image();
texBar.src = "arrow-14x11-1x2-1spacing.png";
var posSourceBar = [
    [0, 0], // purple
    [0, 12], // yellow
];

var texBuilding = new Image();
texBuilding.src = "building-26x40-3x1-1spacing.png";
var posSourceBuilding = [
    [0, 0],
    [27, 0],
    [54, 0]
];

var texPause = new Image();
texPause.src = "pause-14x14-2x1-1spacing.png";
var posSourcePause = [
    [0, 0],
    [15, 0]
];

const carWidth = canvas.width * 1/9;
const carHeight = canvas.height * 1/14;

const ufoWidth = canvas.width * 1/8;
const ufoHeight = canvas.height * 1/8 * 7/9;

const spacer = canvas.height * 1/70;

const playerLevel = carHeight * 10;
var player = new Player(new Vector(canvas.width/2 - carHeight/2, playerLevel), carHeight * 10/11, carHeight, canvas.width/14, 1.5 * canvas.height/14);

var qAbility = new Ability(new Vector(carHeight    , playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "Q", qSound);
var eAbility = new Ability(new Vector(carHeight * 2, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 120, 120, "E", eSound);
var rAbility = new Ability(new Vector(carHeight * 3, playerLevel + carHeight * 2.5), carHeight * 3/4, carHeight * 3/4, 240, 240, "R", rSound);

var wTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7/4), playerLevel + carHeight * 5/4), carHeight * 3/4, carHeight * 3/4, "W");
var sTrigger = new Trigger(new Vector(canvas.width - (carHeight * 7/4), playerLevel + carHeight * 11/4), carHeight * 3/4, carHeight * 3/4, "S");
var aTrigger = new Trigger(new Vector(canvas.width - (carHeight * 10/4), playerLevel + carHeight * 2), carHeight * 3/4, carHeight * 3/4, "A");
var dTrigger = new Trigger(new Vector(canvas.width - carHeight, playerLevel + carHeight * 2), carHeight * 3/4, carHeight * 3/4, "D");

var scoreView = new GameTxt(new Vector(carHeight, playerLevel + carHeight * 3.5), "#5e94d1", carHeight, carHeight/3, "Score: 0");

context.font = carHeight * 1/2 + "px " + font;
let pauseWidth = 0;
let txts = ["Resume", "[S]ave", "[Q]uit Without Saving", "Toggle [M]usic", "Resume [P]revious Game", "New [G]ame"];
for (var i in txts) {
    if (context.measureText(txts[i]).width > pauseWidth) {
        pauseWidth = context.measureText(txts[i]).width;
    }
}
pauseWidth += 40;
var resumeButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 - (carHeight * 3/4 + spacer * 2) * 3/2 - spacer * 3), pauseWidth, carHeight * 3/4 + spacer * 2, "Resume", carHeight * 1/2);
var saveButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 - (carHeight * 3/4 + spacer * 2)/2 - spacer), pauseWidth, carHeight * 3/4 + spacer * 2, "[S]ave", carHeight * 1/2);
var quitButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 + (carHeight * 3/4 + spacer * 2)/2 + spacer), pauseWidth, carHeight * 3/4 + spacer * 2, "[Q]uit Without Saving", carHeight * 1/2);
var musicButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 + (carHeight * 3/4 + spacer * 2) * 3/2 + spacer * 3), pauseWidth, carHeight * 3/4 + spacer * 2, "Toggle [M]usic", carHeight * 1/2);

var previousGameButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 - (carHeight * 3/4 + 20)/2 - spacer), pauseWidth, carHeight * 3/4 + spacer * 2, "Resume [P]revious Game", carHeight * 1/2);
var newGameButton = new ButtonMenu(new Vector(canvas.width/2 - pauseWidth/2, canvas.height/2 + (carHeight * 3/4 + 20)/2 + spacer), pauseWidth, carHeight * 3/4 + spacer * 2, "New [G]ame", carHeight * 1/2);

var restoreButtons = [];
var deleteCount = 0;
{ // so games ('let') stops in here
    let games = JSON.parse(localStorage.getItem("NEO CROSSER - Saved Games"));
    if (games == null) {
        games = [];
        localStorage.setItem("NEO CROSSER - Saved Games", JSON.stringify(games));
    }
    var selectedIndex = games.length > 3 ? 2 : games.length;
}

context.font = carHeight * 5/12 + "px " + font;
let menuWidth = context.measureText("[D]irections").width; // both txts have the same number of characters (by pure chance)
var directionsButton = new ButtonMenu(new Vector(canvas.width/2 - menuWidth/2 - spacer, canvas.height * 1/3 + carHeight * 4 - carHeight * 1/3 - spacer), menuWidth + spacer * 2, carHeight * 5/12 + spacer * 2, "[D]irections", carHeight * 5/12);
var scoresButton = new ButtonMenu(new Vector(canvas.width/2 - menuWidth/2 - spacer, canvas.height * 1/3 + carHeight * 4 + carHeight * 1.3 - carHeight * 1/3 - spacer), menuWidth + spacer * 2, carHeight * 5/12 + spacer * 2, "Top [S]cores", carHeight * 5/12);

var ufos = [];
var cars = [];
var buildings = [];
var lasers = [];
var bar = [];

const base = playerLevel - 3 * carHeight;
var justPlaced = true; // true to skip placing one in the first row
const buildingBlockCount = 5;
for (var i = 0; i < 10; i++) {
    let startPosY = base - (1.5 * carHeight * i);
    let speed = (getRandomInt(i/6 + 1, i/4 + 2)/900) * canvas.width * 2/3;
    speed = getRandomInt(1, 3) == 2 ? -speed : speed;
    cars.push(new Car(startPosY, speed));
    if (Math.random() < buildingBlockCount/10 && !justPlaced) {
        buildings.push(new Building(startPosY));
        justPlaced = true;
    }
    else justPlaced = false;
}

// to make it look like player is moving
const barWidth = 3/4 * carHeight;
const barHeight = (barWidth * 11) / 14; // (33/56) * carHeight
for (i = 0; i < canvas.height/barHeight; i++) {
    bar.push(new Block(new Vector(0, i * barHeight), i, barWidth, barHeight));
    bar.push(new Block(new Vector(canvas.width - barWidth, i * barHeight), i, barWidth, barHeight));
}

var pauseButton = new ButtonExtra(barWidth * 3/4, barWidth * 3/4);

// Fire up the animation engine
window.requestAnimationFrame(drawAll);