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

const fabGroup = document.getElementById("fabGroup");
let focusedFabIndex = -1;

function toggleMainFab() {
    const btn = document.querySelector(".main-fab");
    fabGroup.classList.toggle("active");
    btn.classList.toggle("status-active", fabGroup.classList.contains("active"));

    if (fabGroup.classList.contains("active")) {
        focusedFabIndex = -1;
        updateFabFocus();
    }
}

function updateFabFocus() {
    const options = Array.from(document.querySelectorAll('.fab-options .fab-btn'));
    const mainFab = document.querySelector('.main-fab');
    const allBtns = [mainFab, ...options];

    allBtns.forEach((btn, index) => {
        btn.classList.toggle('focus', index === focusedFabIndex);
    });
}

function toggleHistory() {
    const panel = document.getElementById("historyPanel");
    const btn = document.querySelector(".history-fab");
    panel.classList.toggle("active");
    btn.classList.toggle("status-active", panel.classList.contains("active"));
}

function toggleScientific() {
    const calc = document.querySelector(".calculator");
    const btn = document.querySelector(".scientific-fab");
    calc.classList.toggle("scientific");
    btn.classList.toggle("status-active", calc.classList.contains("scientific"));
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
    const customPanel = document.getElementById("customThemePanel");

    if (theme === 'custom') {
        document.body.classList.add('custom-theme');
        loadCustomTheme();
        if (customPanel) customPanel.classList.add('active');
    } else {
        // Clear custom inline styles and panel
        document.body.style = '';
        if (theme !== 'dark') {
            document.body.classList.add(theme + '-theme');
        }
        if (customPanel) customPanel.classList.remove('active');
    }

    document.querySelectorAll('.theme-opt').forEach(btn => {
        btn.classList.remove('active');
        const text = btn.innerText.toLowerCase();
        if (text === theme || (theme === 'cyberpunk' && text === 'cyber')) {
            btn.classList.add('active');
        } else if (theme === 'custom' && btn.id === 'customThemeOpt') {
            btn.classList.add('active');
        }
    });

    localStorage.setItem('calculator-theme', theme);
    themeMenu.classList.remove("active");
    focusedThemeIndex = -1;
}

function toggleCustomEditor() {
    const panel = document.getElementById("customThemePanel");
    panel.classList.toggle("active");
}

function applyCustomTheme() {
    const colors = {
        '--bg-color': document.getElementById('color-bg').value,
        '--calc-bg': document.getElementById('color-calc').value,
        '--display-bg': document.getElementById('color-display').value,
        '--btn-bg': document.getElementById('color-btn').value,
        '--equal-bg': document.getElementById('color-equal').value,
        '--display-text': document.getElementById('color-text').value,
        '--btn-text': document.getElementById('color-text').value
    };

    const root = document.body;
    for (const [prop, val] of Object.entries(colors)) {
        root.style.setProperty(prop, val);
    }

    // Update dependent colors
    root.style.setProperty('--btn-hover', adjustColor(colors['--btn-bg'], 20));
    root.style.setProperty('--equal-hover', adjustColor(colors['--equal-bg'], 20));
}

function saveCustomTheme() {
    const colors = {
        '--bg-color': document.getElementById('color-bg').value,
        '--calc-bg': document.getElementById('color-calc').value,
        '--display-bg': document.getElementById('color-display').value,
        '--btn-bg': document.getElementById('color-btn').value,
        '--equal-bg': document.getElementById('color-equal').value,
        '--display-text': document.getElementById('color-text').value,
        '--btn-text': document.getElementById('color-text').value
    };

    localStorage.setItem('calculator-custom-colors', JSON.stringify(colors));

    const btn = document.querySelector('.save-theme-btn');
    const originalText = btn.innerText;
    btn.innerText = "Saved! ✓";
    btn.style.background = "#10b981";
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = "";
    }, 2000);
}

function loadCustomTheme() {
    const saved = localStorage.getItem('calculator-custom-colors');
    if (saved) {
        const colors = JSON.parse(saved);
        const root = document.body;
        for (const [prop, val] of Object.entries(colors)) {
            root.style.setProperty(prop, val);

            // Sync inputs
            const inputId = `color-${prop.split('-')[1]}`;
            const input = document.getElementById(inputId);
            if (input) input.value = val;
        }
    }
}

function adjustColor(hex, amt) {
    let usePound = false;
    if (hex[0] == "#") { hex = hex.slice(1); usePound = true; }
    let num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
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
    if (key.toLowerCase() === "m" && !e.ctrlKey && !e.altKey) {
        toggleMainFab();
        return;
    }

    // Main FAB Menu Navigation
    if (fabGroup.classList.contains("active")) {
        const options = Array.from(document.querySelectorAll('.fab-options .fab-btn'));
        const mainFab = document.querySelector('.main-fab');
        const allBtns = [mainFab, ...options]; // Include M as the first element

        if (key === "ArrowRight") {
            e.preventDefault();
            focusedFabIndex = (focusedFabIndex + 1) % allBtns.length;
            updateFabFocus();
            return;
        }
        if (key === "ArrowLeft") {
            e.preventDefault();
            focusedFabIndex = (focusedFabIndex - 1 + allBtns.length) % allBtns.length;
            updateFabFocus();
            return;
        }
        if (key === "Enter" && focusedFabIndex !== -1) {
            e.preventDefault();
            allBtns[focusedFabIndex].click();
            return;
        }
        if (key === "Escape") {
            fabGroup.classList.remove("active");
            document.querySelector(".main-fab").classList.remove("status-active");
            focusedFabIndex = -1;
            updateFabFocus();
            return;
        }
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
        document.querySelector(".main-fab").classList.remove("status-active");
    }
});

// Load saved theme and history
const savedTheme = localStorage.getItem('calculator-theme') || 'dark';
setTheme(savedTheme);
renderHistory();