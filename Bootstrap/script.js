function magic1() {

    console.log("Magic 1")

    but = document.getElementById("magic1But");

    if (but.classList.contains("btn-danger")){
        but.classList.remove("btn-danger");
        but.classList.add("btn-warning");
    }
    else {
        but.classList.remove("btn-warning");
        but.classList.add("btn-danger");
    }    
}

function magic2() {

    console.log("Magic 2")

    but = document.getElementById("magic2But");
    card = document.getElementById("magicCard");

    if (but.classList.contains("btn-dark")){
        but.classList.remove("btn-dark");
        but.classList.add("btn-light");

        card.classList.remove("bg-light");
        card.classList.remove("text-dark");
        card.classList.add("bg-dark");
        card.classList.add("text-light");
    }
    else {
        but.classList.remove("btn-light");
        but.classList.add("btn-dark");

        card.classList.remove("bg-dark");
        card.classList.remove("text-light");
        card.classList.add("bg-light");
        card.classList.add("text-dark");
    }    
}