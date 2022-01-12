class FullNote {
    constructor(note, author) {
        this.note = note;
        this.author = author;
    }
}

var checked = true;
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
    let addButton = document.getElementById("addButton");
    addButton.style.background = "grey";
    let viewButton = document.getElementById("viewButton");
    viewButton.style.background = "lightgray";
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
    let addButton = document.getElementById("addButton");
    addButton.style.background = "lightgray";
    let viewButton = document.getElementById("viewButton");
    viewButton.style.background = "grey";


    let lst = document.getElementById("recordsList");
    lst.innerHTML = "<dl>";

    for (let i = 0; i < notes.length; i++) {
        // TODO: add a onmouseover
        lst.innerHTML += "<dt>" + notes[i].note + "</dt>";
        lst.innerHTML += "<dd>" + "- by: " + notes[i].author + "</dd>";
    }
    lst.innerHTML += "</dl>";
}

function fakeSubmit(note, fullname) {
    if (note == "" || (fullname == "" && checked)) {
        console.log("warn");
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else {
        if (!checked) fullname = "N/A";
        let tempNote = new FullNote(note, fullname);
        notes.push(tempNote);
        localStorage.setItem("notes", JSON.stringify(notes));
        location.reload();
    }
}

function toggleAddName() {
    let div = document.getElementById("name");
    if (!checked) {
        div.removeAttribute("hidden");
    }
    else {
        div.setAttribute("hidden", "");
    }
    checked = !checked
}