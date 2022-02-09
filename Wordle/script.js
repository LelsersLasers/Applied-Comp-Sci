var word;
var avalibleWords;

var wordLen;
var tries;

var guesses;
var stat;

var guessPos = [0, 0];

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    if (word) {
        alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        if (e.key == "Backspace") {
            guesses[guessPos[0]][guessPos[1] - 1] = "";
            if (guessPos[1] > 0) guessPos[1]--;
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
                    }
                    if (match == wordLen) {
                        console.log("WON");
                    }
                    else if (guessPos[0] > tries - 1) {
                        console.log("lost");
                    }
                    guessPos[0]++;
                }
            }
        }
        else if (alphabet.includes(e.key.toLowerCase())) {
            guesses[guessPos[0]][guessPos[1]] = e.key.toUpperCase();
            guessPos[1]++;
        }
        draw();
    }
    else if (e.key == "Enter") {
        startGame();
    }
}

function draw() {
    main = document.getElementById("holder");
    main.innerHTML = "";
    console.log(tries);

    for (var i = 0; i < tries; i++) {
        let txt = "";
        for (var j = 0; j < wordLen; j++) {
            color = "white";
            if (stat[i][j] == 1) color = "yellow";
            else if (stat[i][j] == 2) color = "green";
            else if (i == guessPos[0]) {
                if (guessPos[1] == wordLen && j == 4) color = "grey";
                else if (guessPos[1] == j) color = "grey";
            }

            txt += "<div class='box' id='" + i + "-" + j
                +"' style='background: " + color + "'>"
                + guesses[i][j] + "</div>";
        }
        main.innerHTML += "<div class='row' id='row" + i + "'> " + txt + "</div>";
    }
}

function newWord() {
    localStorage.removeItem('word');
    location.reload(); // reloads the webpage
}


function setupGame() {
    wordLen = localStorage.getItem('wordLen') != null ? localStorage.getItem('wordLen') : 5;
    tries = localStorage.getItem('tries') != null ? localStorage.getItem('tries') : 6;

    avalibleWords = getWordsOfLen(wordLen);
    word = avalibleWords[Math.floor(Math.random() * avalibleWords.length)];
    document.getElementById("temp").innerHTML = word;

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

function startGame() {
    wordLen = document.getElementById("wordLen").value;
    tries = document.getElementById("tries").value;

    localStorage.setItem("wordLen", wordLen);
    localStorage.setItem("tries", tries);

    window.location.href = "index.html";
}