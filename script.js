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
        return;
    }
})