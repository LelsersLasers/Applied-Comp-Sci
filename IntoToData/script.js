var checked = true;
var showAdd = false;
var job = "Other";

var notes = localStorage.getItem("notes") != null ? JSON.parse(localStorage.getItem("notes")) : [];
var accounts = localStorage.getItem("accounts") != null ? JSON.parse(localStorage.getItem("accounts")) : [];

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
        + "<pre>\t- by: " + notes[i].author + " (" + notes[i].job + "), " + notes[i].date + "</pre>"
        + "<button id='" + i + "del' type='button' onclick='del(" + i + ")' hidden>Delete Record</button>"
        + "</div>";
    }
}

function fakeSubmit() {
    let note = document.getElementById("note").value
    let color = document.getElementById("textColor").value;

    if (localStorage.getItem("user") == null){
        let warning = document.getElementById("accountWarning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else if (note == "") {
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else {
        let acc = localStorage.getItem("user");
        let d = new Date();
        let date = (d.getMonth() + 1) + "/" + d.getDate() + "/"  + d.getFullYear();
        let tempNote = {
            "note": note,
            "author": checked ? acc.fullname : "N/A",
            "color": color,
            "job": acc.job,
            "date": date,
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

function changeJob(value) {
    job = value;
}

function setName() {
    var currentUser = localStorage.getItem("user") != null ? JSON.parse(localStorage.getItem("user")).fullname : "Not Signed In";
    var currentUserTxt = document.getElementById("currentUser");
    currentUserTxt.innerHTML = "Current User: " + currentUser;

    if (localStorage.getItem("user") != null) {
        let but = document.getElementById("logOut");
        if (but.hasAttribute("hidden")) {
            but.removeAttribute("hidden");
        }
    }
}

function logIn() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if (username == "" || password == "") {
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else {
        let found = -1;
        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].username == username && accounts[i].password == password) {
                found = i;
            }
        }
        if (found == -1) {
            let warning = document.getElementById("fail");
            if (warning.hasAttribute("hidden")) {
                warning.removeAttribute("hidden");
            }
        }
        else {
            localStorage.setItem("user", JSON.stringify(accounts[found]));
            window.location.href = "index.html";
        }
    }
}

function createAccount() {
    let username = document.getElementById("username").value;
    let password1 = document.getElementById("password1").value;
    let password2 = document.getElementById("password2").value;
    let name = document.getElementById("fullname").value;
    console.log(password1, password2);

    if (username == "" || password1 == "" || password2 == "" || name == "") {
        let warning = document.getElementById("warning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else if (password1 != password2) {
        let warning = document.getElementById("passwordWarning");
        if (warning.hasAttribute("hidden")) {
            warning.removeAttribute("hidden");
        }
    }
    else {
        let newAcc = {
            "username": username,
            "password": password1,
            "fullname": name,
            "job": job
        };
        accounts.push(newAcc);
        localStorage.setItem("user", JSON.stringify(newAcc));
        localStorage.setItem("accounts", JSON.stringify(accounts));
        window.location.href = "index.html";
    }
}

function logOut() {
    localStorage.removeItem("user");
    setName();
}