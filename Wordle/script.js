var word;
var fiveLetterWordList = getWordsOfLen(5);

function getWord() {
    word = localStorage.getItem("word");
    if (word == null || "") {
        word = fiveLetterWordList[Math.floor(Math.random() * fiveLetterWordList.length)];
        localStorage.setItem("word", word);
    }
    document.getElementById("temp").innerHTML = word;
}

var guesses = [];
for (var i = 0; i < 6; i++) {
    guesses.push([]);
    for (var j = 0; j < 5; j++) {
        guesses[i].push("");
    }
}

var stat = [];
for (var i = 0; i < 6; i++) {
    stat.push([]);
    for (var j = 0; j < 5; j++) {
        stat[i].push(0);
    }
}

var guessPos = [0, 0];

document.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(e) {
    alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    if (e.key == "Backspace") {
        guesses[guessPos[0]][guessPos[1] - 1] = "";
        if (guessPos[1] > 0) guessPos[1]--;
    }

    if (guessPos[1] >= 5) {
        if (e.key == "Enter") {
            let guessWord = guesses[guessPos[0]].join("");
            if (fiveLetterWordList.includes(guessWord.toLowerCase())) {
                guessPos[1] = 0;
                let match = 0;
                for (let i = 0; i < 6; i++) {
                    if (guesses[guessPos[0]][i] == word.charAt(i).toUpperCase()) {
                        stat[guessPos[0]][i] = 2;
                        match++;
                    }
                    else if (word.toUpperCase().split("").includes(guesses[guessPos[0]][i])) {
                        stat[guessPos[0]][i] = 1;
                    }
                }
                if (match == 5) {
                    console.log("WON");
                    localStorage.removeItem("word");
                }
                else if (guessPos[0] > 4) {
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

function draw() {
    main = document.getElementById("holder");
    main.innerHTML = "";

    for (var i = 0; i < 6; i++) {
        let txt = "";
        for (var j = 0; j < 5; j++) {
            color = "white";
            if (stat[i][j] == 1) color = "yellow";
            else if (stat[i][j] == 2) color = "green";
            else if (i == guessPos[0]) {
                if (guessPos[1] == 5 && j == 4) color = "grey";
                else if (guessPos[1] == j) color = "grey";
            }

            txt += "<div class='box' id='" + i + "-" + j
                +"' style='background: " + color + "'>"
                + guesses[i][j] + "</div>";
        }
        main.innerHTML += "<div class='row' id='row" + i + "'> " + txt + "</div>";
    }
}

draw();

getWord();
