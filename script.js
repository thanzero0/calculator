const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");

let currentExpression = "";
let history = JSON.parse(localStorage.getItem('calculator-history')) || [];

function handleInput(value, id) {
    // Visual feedback for keyboard
    if (id === null) {
        const btn = Array.from(document.querySelectorAll('button')).find(b => {
            const val = b.dataset.value;
            return val === value ||
                (value === "Enter" && val === "Enter") ||
                (value === "=" && val === "Enter") ||
                (value.toLowerCase() === "c" && val === "c");
        });
        if (btn) {
            btn.classList.add('active-kb');
            setTimeout(() => btn.classList.remove('active-kb'), 100);
        }
    }

    if (id === "clear" || value === "Escape" || value.toLowerCase() === "c") {
        currentExpression = "";
        display.value = "";
        return;
    }

    if (id === "equal" || value === "Enter" || value === "=") {
        if (currentExpression === "") return;
        calculateResult();
        return;
    }

    if (value === "Backspace") {
        currentExpression = currentExpression.toString().slice(0, -1);
        display.value = currentExpression;
        return;
    }

    // Handle Scientific Functions
    const scientificMapping = {
        'sin': 'Math.sin(',
        'cos': 'Math.cos(',
        'tan': 'Math.tan(',
        'log': 'Math.log10(',
        'ln': 'Math.log(',
        'sqrt': 'Math.sqrt(',
        'pow': '**',
        'pi': 'Math.PI',
        'e': 'Math.E'
    };

    if (scientificMapping[value]) {
        currentExpression += scientificMapping[value];
        display.value = currentExpression;
        return;
    }

    // Standard buttons and keyboard
    const operators = ["+", "-", "*", "/", "(", ")", "**", "."];
    if (!isNaN(value) || operators.includes(value)) {
        currentExpression += value;
        display.value = currentExpression;
    }
}

function calculateResult() {
    try {
        const expressionToEval = currentExpression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/\^/g, '**');

        const result = eval(expressionToEval);

        if (result !== undefined && !isNaN(result)) {
            if (!isFinite(result)) {
                throw new Error("Division by zero");
            }
            const historyItem = {
                expr: currentExpression,
                res: result
            };
            addToHistory(historyItem);

            currentExpression = result.toString();
            display.value = currentExpression;
        }
    } catch (error) {
        display.value = "Error";
        setTimeout(() => {
            display.value = currentExpression;
        }, 1500);
    }
}

function addToHistory(item) {
    history.unshift(item);
    if (history.length > 10) history.pop();
    localStorage.setItem('calculator-history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const historyList = document.getElementById("historyList");
    if (!historyList) return;

    historyList.innerHTML = history.map((item, index) => `
        <div class="history-item" onclick="loadHistory(${index})">
            <div class="history-expr">${item.expr}</div>
            <div class="history-res">= ${item.res}</div>
        </div>
    `).join('');
}

function loadHistory(index) {
    currentExpression = history[index].res.toString();
    display.value = currentExpression;
}

function clearHistory() {
    history = [];
    localStorage.removeItem('calculator-history');
    renderHistory();
}

// UI Toggles
function toggleMainFab() {
    document.getElementById("fabGroup").classList.toggle("active");
}

function toggleHistory() {
    document.getElementById("historyPanel").classList.toggle("active");
}

function toggleScientific() {
    document.querySelector(".calculator").classList.toggle("scientific");
}

const themeMenu = document.getElementById("themeMenu");
let focusedThemeIndex = -1;

function toggleThemeMenu() {
    themeMenu.classList.toggle("active");
    if (themeMenu.classList.contains("active")) {
        // Start focus from the currently active theme
        const options = document.querySelectorAll('.theme-opt');
        focusedThemeIndex = Array.from(options).findIndex(opt => opt.classList.contains('active'));
        updateThemeMenuFocus();
    }
}

function updateThemeMenuFocus() {
    const options = document.querySelectorAll('.theme-opt');
    options.forEach((opt, index) => {
        opt.classList.toggle('focus', index === focusedThemeIndex);
    });
}

function setTheme(theme) {
    document.body.className = '';
    if (theme !== 'dark') {
        document.body.classList.add(theme + '-theme');
    }

    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === theme || (theme === 'cyberpunk' && btn.innerText.toLowerCase() === 'cyber')) {
            btn.classList.add('active');
        }
    });

    localStorage.setItem('calculator-theme', theme);
    themeMenu.classList.remove("active");
    focusedThemeIndex = -1;
}

window.addEventListener("keydown", function (e) {
    const key = e.key;

    // Theme Menu Navigation
    if (themeMenu.classList.contains("active")) {
        const options = document.querySelectorAll('.theme-opt');
        if (key === "ArrowDown") {
            e.preventDefault();
            focusedThemeIndex = (focusedThemeIndex + 1) % options.length;
            updateThemeMenuFocus();
            return;
        }
        if (key === "ArrowUp") {
            e.preventDefault();
            focusedThemeIndex = (focusedThemeIndex - 1 + options.length) % options.length;
            updateThemeMenuFocus();
            return;
        }
        if (key === "Enter" && focusedThemeIndex !== -1) {
            e.preventDefault();
            options[focusedThemeIndex].click();
            return;
        }
        if (key === "Escape") {
            themeMenu.classList.remove("active");
            return;
        }
    }

    // Global Shortcuts
    if (key.toLowerCase() === "t" && !e.ctrlKey && !e.altKey) {
        toggleThemeMenu();
        return;
    }
    if (key.toLowerCase() === "h" && !e.ctrlKey && !e.altKey) {
        toggleHistory();
        return;
    }
    if (key.toLowerCase() === "s" && !e.ctrlKey && !e.altKey) {
        toggleScientific();
        return;
    }

    const allowedKeys = [
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ".",
        "+", "-", "*", "/", "(", ")", "^",
        "Enter", "=", "Backspace", "Escape", "c", "C"
    ];

    if (allowedKeys.includes(key)) {
        if (key === "/" || key === "(" || key === ")") e.preventDefault();
        // Prevent enter from clicking the last focused button
        if (key === "Enter") e.preventDefault();
        handleInput(key === "^" ? "**" : key, null);
    }
});

buttons.addEventListener("click", function (e) {
    const button = e.target;
    if (button.tagName !== "BUTTON") return;

    // Prevent button focus to fix Enter key double input
    button.blur();

    handleInput(button.dataset.value || button.innerText, button.id);
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-fab-container")) {
        themeMenu.classList.remove("active");
    }
    if (!e.target.closest("#fabGroup")) {
        document.getElementById("fabGroup").classList.remove("active");
    }
});

// Load saved theme and history
const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
setTheme(savedTheme);
renderHistory();