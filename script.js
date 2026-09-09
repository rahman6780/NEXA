const input = document.getElementById("input");
const send = document.getElementById("send");
const chat = document.getElementById("chat");

function addMessage(text, type) {
    const message = document.createElement("div");
    message.className = `message ${type}`;
    message.textContent = text;
    chat.appendChild(message);
    chat.scrollTop = chat.scrollHeight;
}

function askNexa() {
    const question = input.value.trim();

    if (!question) return;

    addMessage(question, "user");
    input.value = "";

    const q = question.toLowerCase();

    let answer;

    if (q.includes("halo") || q.includes("hai")) {
        answer = "Halo Wak 🗿🔥 Gue NEXA!";
    } else if (q.includes("siapa kamu")) {
        answer = "Gue NEXA, AI Assistant buatan Wak.";
    } else if (q.includes("termux")) {
        answer = "Termux adalah terminal Linux di Android. 🗿";
    } else if (q.includes("nexa")) {
        answer = "NEXA masih berkembang. Kita bikin pelan-pelan sampai makin canggih 🔥";
    } else {
        answer = "Gue belum punya jawaban untuk itu, Wak 🗿";
    }

    setTimeout(() => {
        addMessage(answer, "nexa");
    }, 300);
}

send.addEventListener("click", askNexa);

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        askNexa();
    }
});
// =========================
// ABOUT NEXA
// =========================

const aboutBtn = document.getElementById("aboutBtn");
const aboutBox = document.getElementById("aboutBox");
const closeAbout = document.getElementById("closeAbout");

aboutBtn.addEventListener("click", () => {
    aboutBox.classList.add("show");
});

closeAbout.addEventListener("click", () => {
    aboutBox.classList.remove("show");
});

// =========================
// CUSTOM BACKGROUND
// =========================

const customBtn = document.getElementById("customBtn");
const customBox = document.getElementById("customBox");
const closeCustom = document.getElementById("closeCustom");
const bgColor = document.getElementById("bgColor");
const bgImage = document.getElementById("bgImage");
const resetBg = document.getElementById("resetBg");

customBtn.addEventListener("click", () => {
    customBox.classList.add("show");
});

closeCustom.addEventListener("click", () => {
    customBox.classList.remove("show");
});

bgColor.addEventListener("input", () => {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = bgColor.value;

    localStorage.setItem("nexaBgColor", bgColor.value);
    localStorage.removeItem("nexaBgImage");
});

bgImage.addEventListener("change", () => {
    const file = bgImage.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
        document.body.style.backgroundImage = `url("${reader.result}")`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";

        localStorage.setItem("nexaBgImage", reader.result);
    };

    reader.readAsDataURL(file);
});

resetBg.addEventListener("click", () => {
    localStorage.removeItem("nexaBgColor");
    localStorage.removeItem("nexaBgImage");

    document.body.style.backgroundColor = "";
    document.body.style.backgroundImage = "";
});

const savedBgColor = localStorage.getItem("nexaBgColor");
const savedBgImage = localStorage.getItem("nexaBgImage");

if (savedBgImage) {
    document.body.style.backgroundImage = `url("${savedBgImage}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
} else if (savedBgColor) {
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = savedBgColor;
    bgColor.value = savedBgColor;
}
