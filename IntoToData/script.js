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
    lst.innerHTML = "";

    for (let i = 0; i < notes.length; i++) {
        lst.innerHTML += "<div class='blue' id='" + i + "' onmouseover='hover(" + i + ")' onmouseout='unhover(" + i + ")'>"
        + "<p style='color: " + notes[i].color + ";'>" + notes[i].note + "</p>"
        + "<pre>\t- by: " + notes[i].author + "</pre>"
        + "<button id='" + i + "del' type='button' onclick='del(" + i + ")' hidden>Delete</button>"
        + "</div>";
    }
}

function fakeSubmit() {
    let note = document.getElementById("note").value
    let fullname = document.getElementById("fullname").value;
    let color = document.getElementById("textColor").value;

    if (note == "" || (fullname == "" && checked)) {
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else {
        if (!checked) fullname = "N/A";
        let tempNote = {
            "note": note,
            "author": fullname,
            "color": color,
        };
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

function hover(id) {
    let item = document.getElementById(id);
    item.style.background = "lightblue";
    let button = document.getElementById(id + "del");
    button.removeAttribute("hidden");
}

function unhover(id) {
    let item = document.getElementById(id);
    item.style.background = "white";
    let button = document.getElementById(id + "del");
    button.setAttribute("hidden", "");
}

function del(i) {
    notes.splice(i, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    view();
}

function changeColor() {
    let color = document.getElementById("textColor");
    let text = document.getElementById("note");
    text.style.color = color.value;
}