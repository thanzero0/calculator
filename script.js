const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let angka1 = "";
let angka2 = "";
let operator = "";

buttons.addEventListener("click", function (e) {
    const button = e.target;
  
    if (button.tagName !== "BUTTON") return;
  
    const value = button.dataset.value;
  
    if (button.id === "clear") {
        angka1 = "";
        angka2 = "";
        operator = "";
        display.value = "";
        return;
    }
  
    if (button.id === "equal") {
        if (angka1 === "" || operator === "" || angka2 === "") return;
  
        const hasil = hitung(
            Number(angka1),
            Number(angka2),
            operator
        );
  
        display.value = hasil;
  
        angka1 = hasil.toString();
        angka2 = "";
        operator = "";
        return;
    }
  
    if (value === "+" || value === "-" || value === "*" || value === "/") {
        if (operator !== "" || display.value === "") return;
  
        operator = value;
        angka1 = display.value;
        display.value = "";
        return;
    }
  
    // ANGKA / TITIK
    if (operator === "") {
        angka1 += value;
        display.value = angka1;
    } else {
        angka2 += value;
        display.value = angka2;
    }
  });

function hitung(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") {
        if (b === 0) return error;
        return a /b;
    }

}