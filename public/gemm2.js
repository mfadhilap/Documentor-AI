document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const pdfFile = urlParams.get("pdf");
    const pdfFrame = document.getElementById("pdf-frame");

    if (pdfFile) {
        pdfFrame.src = `/uploads/${decodeURIComponent(pdfFile)}`;
    }

    const assistanceBtn = document.getElementById("assistance-btn");
    const chatContainer = document.getElementById("chat-container");
    const options = document.getElementById("options");
    const questionBox = document.getElementById("question-box");
    const chatMessages = document.getElementById("chat-messages");
    const questionInput = document.getElementById("question");
    const sendQuestionBtn = document.getElementById("send-question");

    let selectedOption = "";

    assistanceBtn.addEventListener("click", () => {
        chatContainer.classList.remove("hidden");
    });

    document.getElementById("full-pdf").addEventListener("click", () => {
        selectedOption = "full";
        options.classList.add("hidden");
        questionBox.classList.remove("hidden");
    });

    document.getElementById("select-pages").addEventListener("click", () => {
        selectedOption = "select";
        options.classList.add("hidden");
        questionBox.classList.remove("hidden");
    });

    sendQuestionBtn.addEventListener("click", async () => {
        const question = questionInput.value.trim();
        if (!question) return;

        chatMessages.innerHTML += `<div class="user-msg">${question}</div>`;

        const response = await fetch("/ask-question", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                question, 
                pdf: pdfFile, 
                mode: selectedOption 
            }),
        });

        const data = await response.json();
        chatMessages.innerHTML += `<div class="ai-msg">${data.answer}</div>`;
        questionInput.value = "";
    });
});
