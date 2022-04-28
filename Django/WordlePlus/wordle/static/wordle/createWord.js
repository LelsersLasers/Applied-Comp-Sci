var checkboxes = [true, true]

function toggle(id) {
    checkboxes[id] = !checkboxes[id];
}


function SPCreateWord() {
    wordLen = document.getElementById("wordLen").value;
    tries = document.getElementById("tries").value
    if (wordLen >= 3 && wordLen <= 10) {
        if (tries <= 100) {
            document.getElementById("wordLenSub").value = wordLen;
            document.getElementById("triesSub").value = tries;
            document.getElementById("doubleLettersSub").value = checkboxes[0];
            document.getElementById("commonSub").value = checkboxes[1];
            document.getElementById("wordGen").submit();
        }
    }
    else document.getElementById("wordLen").style.border = "1px solid red";
}