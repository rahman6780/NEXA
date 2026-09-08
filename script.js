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
