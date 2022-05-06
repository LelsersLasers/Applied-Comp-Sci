function toggleVisibility(idNumber) {
    input = document.getElementById("password" + idNumber);
    button = document.getElementById("togglePassword");
    if (input.getAttribute("type") == "password"){
        input.setAttribute("type", "text");
        button.innerHTML = "<i class='toggleVisable'>(O)</i>";
    }
    else {
        input.setAttribute("type", "password");
        button.innerHTML = "<i class='toggleVisable'><s>(O)</s></i>";
    }
}