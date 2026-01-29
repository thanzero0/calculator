const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let expression = "";

buttons.addEventListener("click", (e) => {
    const btn = e.target;

    if (!btn.dataset.value && btn.id !== "equal" && btn.id !== "clear") return;

    if (btn.id === "clear") {
        expression = "";
        display.value = "";
        return;
    }

    if (btn.id === "equal") {
        try {
        expression = eval(expression).toString();
        display.value = expression;
    } catch {
        display.value = "Error";
        expression = "";
    }
    return;
}

    expression += btn.dataset.value;
    display.value = expression;
});
