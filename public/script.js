const socket = io();

const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const usernamePopup = document.getElementById('username-popup');
const usernameInput = document.getElementById('username-input');
const usernameSubmit = document.getElementById('username-submit');
const chatContainer = document.getElementById('chat-container');

let username = '';  
let canRecieve = true;

window.onload = function() {
    usernamePopup.style.display = 'flex';
    chatContainer.style.display = 'flex';
};

usernameSubmit.addEventListener('click', function() {
    username = usernameInput.value.trim();
    if (username) {
        usernamePopup.style.display = 'none';  
        chatContainer.style.display = 'flex';  
    } else {
        alert('Please enter a username!');
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    if (message && username) {
        const timestamp = new Date().toLocaleTimeString(); 
        socket.emit('sendMessage', { text: message, time: timestamp, sender: username });
        appendMessage(message, timestamp, 'sent', username);
        
        setTimeout(() => {
            canRecieve = true;
        }, 500);
        messageInput.value = '';
    }
}


sendButton.addEventListener('click', sendMessage);


messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage(); 
    }
});

socket.on('receiveMessage', ({ text, time, sender }) => {
    if (canRecieve){
        appendMessage(text, time, 'received', sender); 
    }
});

function appendMessage(text, time, type, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', type); 
    
    messageElement.innerHTML = `<strong style="font-size: 0.9em; color: gray;">${sender}</strong><br>${text} <span style="font-size: 0.8em; color: gray;">${time}</span>`;
    
    messagesContainer.appendChild(messageElement);
    
    messageElement.style.opacity = 0;
    setTimeout(() => {
        messageElement.style.transition = "opacity 0.5s";
        messageElement.style.opacity = 1;
    }, 0);

    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
