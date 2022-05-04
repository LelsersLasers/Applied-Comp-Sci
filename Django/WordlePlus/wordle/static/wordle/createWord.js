var checkboxes = [true, true]

function toggle(id) {
    checkboxes[id] = !checkboxes[id];
}


function SPCreateWord() {
    wordLen = document.getElementById("wordLen").value;
    tries = document.getElementById("tries").value
    
    if (wordLen < 3 || wordLen > 10) document.getElementById("wordLen").style.outline = "1px solid red";
    else document.getElementById("wordLen").style.outline = "none";
    
    if (tries > 100) document.getElementById("tries").style.outline = "1px solid red";
    else document.getElementById("tries").style.outline = "none";

    if (wordLen >= 3 && wordLen <= 10 && tries <= 100) {
        document.getElementById("wordLenSub").value = wordLen;
        document.getElementById("triesSub").value = tries;
        document.getElementById("doubleLettersSub").value = checkboxes[0];
        document.getElementById("commonSub").value = checkboxes[1];
        document.getElementById("wordGen").submit();
    }
}