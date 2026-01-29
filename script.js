const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let angka1 = "";
let angka2 = "";
let operator = "";

function handleInput(value, id) {
    if (id === "clear" || value === "Escape" || value.toLowerCase() === "c") {
        angka1 = "";
        angka2 = "";
        operator = "";
        display.value = "";
        return;
    }

    if (id === "equal" || value === "Enter" || value === "=") {
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

    if (value === "Backspace") {
        if (operator === "") {
            angka1 = angka1.slice(0, -1);
            display.value = angka1;
        } else {
            if (angka2 === "") {
                operator = "";
                display.value = angka1;
            } else {
                angka2 = angka2.slice(0, -1);
                display.value = angka2;
            }
        }
        return;
    }

    if (value === "+" || value === "-" || value === "*" || value === "/") {
        if (display.value === "" && angka1 === "") return;
        if (operator !== "") return;

        operator = value;
        angka1 = display.value;
        display.value = "";
        return;
    }

    // ANGKA / TITIK
    if (!isNaN(value) || value === ".") {
        if (operator === "") {
            angka1 += value;
            display.value = angka1;
        } else {
            angka2 += value;
            display.value = angka2;
        }
    }
}

buttons.addEventListener("click", function (e) {
    const button = e.target;
    if (button.tagName !== "BUTTON") return;
    handleInput(button.dataset.value || null, button.id);
});

window.addEventListener("keydown", function (e) {
    const key = e.key;
    if (
        !isNaN(key) ||
        key === "." ||
        ["+", "-", "*", "/", "Enter", "=", "Backspace", "Escape"].includes(key) ||
        key.toLowerCase() === "c"
    ) {
        if (key === "/") e.preventDefault(); // Prevent browser search
        handleInput(key, null);
    }
});

const themeMenu = document.getElementById("themeMenu");

function toggleThemeMenu() {
    themeMenu.classList.toggle("active");
}

function setTheme(theme) {
    document.body.className = '';
    if (theme !== 'dark') {
        document.body.classList.add(theme + '-theme');
    }

    // Update active button state
    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === theme) {
            btn.classList.add('active');
        }
    });

    // Save preference
    localStorage.setItem('calculator-theme', theme);
    themeMenu.classList.remove("active");
}

// Close menu when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-fab-container")) {
        themeMenu.classList.remove("active");
    }
});

// Load saved theme
const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
setTheme(savedTheme);

function hitung(a, b, op) {
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") {
        if (b === 0) return "Error";
        return a / b;
    }

}