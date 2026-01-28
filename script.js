const display = document.getElementById("display");
const buttons = document.querySelectorAll("button[data-value]");
const clearBtn = document.getElementById("clear");
const equalBtn = Document.getElementById("equal");

let expression = "";

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        expression += button.dataset.value;
        display.value = expression;
    })
});

clearBtn.addEventListener("click", () => {
    expression = "";
    display.value = "";
});

equalBtn.addEventListener("click", () => {
    try {
        expression = eval(expression).toString();
        display.value = expression;
    } catch {
        display.value = "Error";
        expression = "";
    }
});