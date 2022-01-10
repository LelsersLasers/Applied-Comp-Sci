class FullNote {
    constructor(note, author) {
        this.note = note;
        this.author = author;
    }
}


var notes = localStorage.getItem("notes") != null ? JSON.parse(localStorage.getItem("notes")) : [];
var showAdd = false;

function add() {
    let thingsToShow = document.getElementsByClassName("add");
    for (let i = 0; i < thingsToShow.length; i++) {
        if (thingsToShow[i].hasAttribute("hidden")) {
            thingsToShow[i].removeAttribute("hidden");
        }
    }
    let thingsToHide = document.getElementsByClassName("view");
    for (let i = 0; i < thingsToHide.length; i++) {
        if (!thingsToHide[i].hasAttribute("hidden")) {
            thingsToHide[i].setAttribute("hidden", "");
        }
    }
}

function view() {
    let thingsToShow = document.getElementsByClassName("view");
    for (let i = 0; i < thingsToShow.length; i++) {
        if (thingsToShow[i].hasAttribute("hidden")) {
            thingsToShow[i].removeAttribute("hidden");
        }
    }
    let thingsToHide = document.getElementsByClassName("add");
    for (let i = 0; i < thingsToHide.length; i++) {
        if (!thingsToHide[i].hasAttribute("hidden")) {
            thingsToHide[i].setAttribute("hidden", "");
        }
    }


    let lst = document.getElementById("recordList");

    for (let i = 0; i < notes.length; i++) {
        let noteBody = document.createElement("dt");
        let noteTextNode = document.createTextNode(notes[i].note);
        noteBody.appendChild(noteTextNode);
        lst.appendChild(noteBody);

        let authorBody = document.createElement("dd");
        let authorTextNode = document.createTextNode("- " + notes[i].author);
        authorBody.appendChild(authorTextNode);
        lst.appendChild(authorBody);
    }
}

function fakeSubmit(note, fullname) {
    if (note != "" && fullname != "") {
        let tempNote = new FullNote(note, fullname);
        notes.push(tempNote);
        localStorage.setItem("notes", JSON.stringify(notes));
        location.reload();
    }
    else {
        console.log("asdad");
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
}