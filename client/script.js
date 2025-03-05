const socket = new WebSocket("wss://yourapp.onrender.com");
let username = "";
let colors = {};

// Show username modal
document.getElementById("save-username-btn").addEventListener("click", () => {
    username = document.getElementById("username-input").value.trim();
    if (username) {
        document.querySelector(".overlay").style.display = "none";
        document.querySelector(".chat-container").style.display = "block";
    }
});

// Assign unique colors to users
function getUserColor(user) {
    if (!colors[user]) {
        const randomColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
        colors[user] = randomColor;
    }
    return colors[user];
}

// Handle incoming messages
socket.onmessage = (event) => {
    const chatBox = document.getElementById("chat-box");
    const data = JSON.parse(event.data);
    
    // If typing indicator
    if (data.type === "typing") {
        document.getElementById("typing-indicator").textContent = data.message;
        setTimeout(() => document.getElementById("typing-indicator").textContent = "", 1000);
        return;
    }
    
    // Message display
    const messageElem = document.createElement("p");
    messageElem.innerHTML = `<strong style="color: ${getUserColor(data.user)}">${data.user}:</strong> ${data.message}`;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
};

// Send message
document.getElementById("send-btn").addEventListener("click", () => {
    const input = document.getElementById("message-input");
    const message = input.value.trim();
    if (message && username) {
        socket.send(JSON.stringify({ user: username, message: message }));
        input.value = "";
    }
});

// Typing Indicator
document.getElementById("message-input").addEventListener("input", () => {
    socket.send(JSON.stringify({ type: "typing", message: `${username} is typing...` }));
});
