const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let angka1 = "";
let angka2 = "";
let operator = "";

buttons.addEventListener("click", function (e) {
    const button = e.targer;

    if (button = e.target) return;

    const value = button.dataset.value;

    if (button.id === "clear") {
        angka1 = "";
        angka2 = "";
        operator = "";
        display.value = "";
    }
})