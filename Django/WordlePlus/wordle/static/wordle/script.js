var word;
var avalibleWords;

var wordLen;
var tries;
var infiniteTries = false;

var guesses;
var stat;

var state = "game";

var guessPos = [0, 0];

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (word && state == "game") {
        alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        if (e.key == "Backspace") {
            guesses[guessPos[0]][guessPos[1] - 1] = "";
            if (guessPos[1] > 0) guessPos[1]--;
            document.getElementById("info").innerHTML = " ";
        }
        if (guessPos[1] >= wordLen) {
            if (e.key == "Enter") {
                let guessWord = guesses[guessPos[0]].join("");
                if (avalibleWords.includes(guessWord.toLowerCase())) {
                    guessPos[1] = 0;
                    let match = 0;
                    for (let i = 0; i < wordLen; i++) {
                        if (guesses[guessPos[0]][i] == word.charAt(i).toUpperCase()) {
                            stat[guessPos[0]][i] = 2;
                            match++;
                        }
                        else if (word.toUpperCase().split("").includes(guesses[guessPos[0]][i])) {
                            stat[guessPos[0]][i] = 1;
                        }
                        else {
                            stat[guessPos[0]][i] = -1;
                        }
                    }
                    if (match == wordLen) {
                        state = "won";
                    }
                    else if (guessPos[0] >= tries - 1 && !infiniteTries) {
                        state = "lost";
                    }
                    guessPos[0]++;
                    document.getElementById("info").innerHTML = "";
                    if (infiniteTries && state == "game") {
                        tries++;
                        guesses.push([]);
                        for (var j = 0; j < wordLen; j++) {
                            guesses[guesses.length - 1].push("");
                        }
                        stat.push([]);
                        for (var j = 0; j < wordLen; j++) {
                            stat[stat.length - 1].push(0);
                        }
                    }
                }
                else {
                    document.getElementById("info").innerHTML = "Guesses must be words";
                }
            }
        }
        else if (alphabet.includes(e.key.toLowerCase())) {
            guesses[guessPos[0]][guessPos[1]] = e.key.toUpperCase();
            guessPos[1]++;
        }
        draw();
    }
    else if (e.key == "Enter" && !word) {
        startGame();
    }
}

function draw() {
    main = document.getElementById("holder");
    main.innerHTML = "";

    for (var i = 0; i < tries; i++) {
        let txt = "";
        for (var j = 0; j < wordLen; j++) {
            color = "white";
            if (stat[i][j] == 1) color = "yellow";
            else if (stat[i][j] == 2) color = "green";
            else if (i == guessPos[0]) {
                if (guessPos[1] == wordLen && j == 4) color = "lightgrey";
                else if (guessPos[1] == j) color = "lightgrey";
            }
            else if (stat[i][j] == -1) {
                color = "grey; color: white"
            }
            if (guesses[i][j] != "" && stat[i][j] == 0) {
                color += "; border: 1px solid black";
            }

            txt += "<div class='box' id='" + i + "-" + j
                +"' style='background: " + color + "'>"
                + guesses[i][j] + "</div>";
        }
        main.innerHTML += "<div class='row' id='row" + i + "'> " + txt + "</div>";
    }
    if (state == "lost") document.getElementById("info").innerHTML = "You lost! The correct word was: " + word;
    else if (state == "won") document.getElementById("info").innerHTML = "YOU WON!";
}

function newWord() {
    window.location.href = "generateWord.html";
}


function showWord() {
    state = "lost";
    document.getElementById("info").innerHTML = "You lost! The correct word was: " + word;
}

function setupGame() {
    wordLen = localStorage.getItem('wordLen') != null ? localStorage.getItem('wordLen') : 5;
    tries = localStorage.getItem('tries') != null ? localStorage.getItem('tries') : 6;
    if (tries < 1) {
        infiniteTries = true;
        tries = 1;
    }

    avalibleWords = getWordsOfLen(wordLen);
    word = avalibleWords[Math.floor(Math.random() * avalibleWords.length)];

    guesses = [];
    for (var i = 0; i < tries; i++) {
        guesses.push([]);
        for (var j = 0; j < wordLen; j++) {
            guesses[i].push("");
        }
    }

    stat = [];
    for (var i = 0; i < 6; i++) {
        stat.push([]);
        for (var j = 0; j < 5; j++) {
            stat[i].push(0);
        }
    }

    draw();
}

function SPCreateWord() {
    wordLen = document.getElementById("wordLen").value;
    tries = document.getElementById("tries").value;

    if (wordLen > 2 && wordLen < 10) {
        console.log("asdaskldjsal")
        let avalibleWords = getWordsOfLen(wordLen);
        document.getElementById("word").value = avalibleWords[Math.floor(Math.random() * avalibleWords.length)];
        document.getElementById("tries").value = tries;
        document.getElementById("wordGen").submit();
    }
}