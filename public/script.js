const socket = io();

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

let canRecieve = true;

// Function to send the message
function sendMessage() {
    const message = messageInput.value.trim();
    if (message) {
        const timestamp = new Date().toLocaleTimeString(); // Get the current time
        // Emit the message to the server
        socket.emit('sendMessage', { text: message, time: timestamp, sender: 'me' });
        appendMessage(message, timestamp, 'sent'); // Append sent message immediately
        canRecieve = false;
        
        setTimeout(() => {
            canRecieve = true;
        }, 500);
        messageInput.value = ''; // Clear input after sending
    }
}

// Event listener for the send button
sendButton.addEventListener('click', sendMessage);

// Event listener for the Enter key
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission
        sendMessage(); // Call the send message function
    }
});

// Listen for incoming messages from the server
socket.on('receiveMessage', ({ text, time }) => {
    if (canRecieve){
        appendMessage(text, time, 'received'); // Append received message
    }
});

// Function to append messages to the chat
function appendMessage(text, time, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type); // Add the type class (sent or received)
    messageElement.innerHTML = `${text} <span style="font-size: 0.8em; color: gray;">${time}</span>`;
    messagesContainer.appendChild(messageElement);
    
    // Fade-in effect for new messages
    messageElement.style.opacity = 0;
    setTimeout(() => {
        messageElement.style.transition = "opacity 0.5s";
        messageElement.style.opacity = 1;
    }, 0);

    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}
