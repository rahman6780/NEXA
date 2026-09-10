document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const send = document.getElementById("send");
    const chat = document.getElementById("chat");

    // =========================
    // NEXA CHAT SESSION
    // =========================

    let chatHistory = JSON.parse(
        localStorage.getItem("nexaChatHistory") || "[]"
    );

    function addMessage(text, type) {
        const message = document.createElement("div");
        message.className = `message ${type}`;
        message.textContent = text;

        chat.appendChild(message);
        chat.scrollTop = chat.scrollHeight;
    }

    function saveChatHistory() {
        localStorage.setItem(
            "nexaChatHistory",
            JSON.stringify(chatHistory)
        );
    }

    function loadChatHistory() {
        chatHistory.forEach((message) => {
            if (message.role === "user") {
                addMessage(message.content, "user");
            } else if (message.role === "assistant") {
                addMessage(message.content, "nexa");
            }
        });
    }

    async function askNexa() {
        const question = input.value.trim();

        if (!question) return;

        addMessage(question, "user");
        input.value = "";

        const thinking = document.createElement("div");
        thinking.className = "message nexa thinking-message";
        thinking.textContent = "NEXA sedang berpikir...";

        chat.appendChild(thinking);
        chat.scrollTop = chat.scrollHeight;

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question,
                    history: chatHistory
                })
            });

            const data = await response.json();

            thinking.remove();

            if (!response.ok) {
                throw new Error(
                    data.error || "Terjadi kesalahan."
                );
            }

            addMessage(data.answer, "nexa");

            chatHistory.push({
                role: "user",
                content: question
            });

            chatHistory.push({
                role: "assistant",
                content: data.answer
            });

            saveChatHistory();

        } catch (error) {
            thinking.remove();

            addMessage(
                "Maaf, NEXA sedang mengalami gangguan. Silakan coba lagi.",
                "nexa"
            );

            console.error("NEXA error:", error);
        }
    }

    send.addEventListener("click", askNexa);

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            askNexa();
        }
    });

    // =========================
    // LOAD CHAT
    // =========================

    loadChatHistory();

    // =========================
    // ABOUT NEXA
    // =========================

    const aboutBtn = document.getElementById("aboutBtn");
    const aboutBox = document.getElementById("aboutBox");
    const closeAbout = document.getElementById("closeAbout");

    if (aboutBtn && aboutBox && closeAbout) {
        aboutBtn.addEventListener("click", () => {
            aboutBox.classList.add("show");
        });

        closeAbout.addEventListener("click", () => {
            aboutBox.classList.remove("show");
        });
    }

    // =========================
    // CUSTOM BACKGROUND
    // =========================

    const customBtn = document.getElementById("customBtn");
    const customBox = document.getElementById("customBox");
    const closeCustom = document.getElementById("closeCustom");
    const bgColor = document.getElementById("bgColor");
    const bgImage = document.getElementById("bgImage");
    const resetBg = document.getElementById("resetBg");

    if (
        customBtn &&
        customBox &&
        closeCustom &&
        bgColor &&
        bgImage &&
        resetBg
    ) {
        customBtn.addEventListener("click", () => {
            customBox.classList.add("show");
        });

        closeCustom.addEventListener("click", () => {
            customBox.classList.remove("show");
        });

        bgColor.addEventListener("input", () => {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor = bgColor.value;

            localStorage.setItem(
                "nexaBgColor",
                bgColor.value
            );

            localStorage.removeItem("nexaBgImage");
        });

        bgImage.addEventListener("change", () => {
            const file = bgImage.files[0];

            if (!file) return;

            const reader = new FileReader();

            reader.onload = () => {
                document.body.style.backgroundImage =
                    `url("${reader.result}")`;

                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundAttachment = "fixed";

                localStorage.setItem(
                    "nexaBgImage",
                    reader.result
                );
            };

            reader.readAsDataURL(file);
        });

        resetBg.addEventListener("click", () => {
            localStorage.removeItem("nexaBgColor");
            localStorage.removeItem("nexaBgImage");

            document.body.style.backgroundColor = "";
            document.body.style.backgroundImage = "";
        });

        const savedBgColor =
            localStorage.getItem("nexaBgColor");

        const savedBgImage =
            localStorage.getItem("nexaBgImage");

        if (savedBgImage) {
            document.body.style.backgroundImage =
                `url("${savedBgImage}")`;

            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
            document.body.style.backgroundAttachment = "fixed";

        } else if (savedBgColor) {
            document.body.style.backgroundImage = "none";
            document.body.style.backgroundColor =
                savedBgColor;

            bgColor.value = savedBgColor;
        }
    }

    // =========================
    // NEXA DEEP SPACE
    // =========================

    const deepSpaceBackground =
        "url('backgrounds/nexa_deep_space.png')";

    document.body.style.backgroundImage =
        deepSpaceBackground;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";

    localStorage.setItem("nexaBgPreset", "space");

    // =========================
    // NEW CHAT
    // =========================

    const newChatBtn =
        document.getElementById("newChatBtn");

    if (newChatBtn) {
        newChatBtn.addEventListener("click", () => {
            const confirmNewChat = confirm(
                "Mulai chat baru? Percakapan saat ini akan dihapus."
            );

            if (!confirmNewChat) return;

            localStorage.removeItem(
                "nexaChatHistory"
            );

            chatHistory = [];

            chat.innerHTML = `
                <div class="message nexa">
                    Halo! 👋<br>
                    Selamat datang di NEXA. Ada yang bisa saya bantu hari ini?
                </div>
            `;
        });
    }

    // =========================
    // LAPOR BUG
    // =========================

    const bugBtn =
        document.getElementById("bugBtn");

    if (bugBtn) {
        bugBtn.addEventListener("click", () => {
            const bug = prompt(
                "Jelaskan bug yang kamu temukan di NEXA:"
            );

            if (!bug || !bug.trim()) return;

            const subject =
                encodeURIComponent(
                    "Laporan Bug NEXA"
                );

            const body =
                encodeURIComponent(
                    "Halo Rahman,\n\n" +
                    "Saya menemukan bug di NEXA.\n\n" +
                    "Laporan bug:\n" +
                    bug.trim() +
                    "\n\n" +
                    "Terima kasih."
                );

            window.location.href =
                `mailto:meletes86@gmail.com?subject=${subject}&body=${body}`;
        });
    }
});
