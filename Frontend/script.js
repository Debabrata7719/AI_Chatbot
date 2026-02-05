document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatArea = document.getElementById('chat-area');
    const emptyState = document.querySelector('.empty-state');

    /* -------------------------
       Auto resize textarea
    ------------------------- */
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';

        if (this.value === '') {
            this.style.height = 'auto';
        }
    });

    /* -------------------------
       Enter to send
    ------------------------- */
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendBtn.addEventListener('click', sendMessage);

    /* -------------------------
       Main send function
    ------------------------- */
    function sendMessage() {
        const text = messageInput.value.trim();
        if (!text) return;

        if (emptyState) emptyState.style.display = 'none';

        appendMessage(text, 'user');

        messageInput.value = '';
        messageInput.style.height = 'auto';

        sendMessageToBackend(text);
    }

    /* -------------------------
       Add message to UI
    ------------------------- */
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        messageDiv.textContent = text;

        chatArea.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    /* -------------------------
       Typing indicator
    ------------------------- */
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot');
        typingDiv.id = 'typing';
        typingDiv.textContent = 'Typing...';
        chatArea.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTyping() {
        const typing = document.getElementById('typing');
        if (typing) typing.remove();
    }

    /* -------------------------
       🔥 REAL FastAPI CALL
    ------------------------- */
    async function sendMessageToBackend(userMessage) {
        showTyping();

        try {
            const response = await fetch("http://127.0.0.1:8000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();

            removeTyping();
            appendMessage(data.response, 'bot');

        } catch (error) {
            removeTyping();
            console.error("Backend error:", error);
            appendMessage("⚠️ Backend not running. Start FastAPI server.", 'bot');
        }
    }
});
