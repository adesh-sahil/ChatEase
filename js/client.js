const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const messageElements = document.querySelectorAll('.message');


messageInput.addEventListener('input', () => {
    const lineHeight = parseFloat(getComputedStyle(messageInput).lineHeight);
    const lines = messageInput.scrollHeight / lineHeight;

    if (lines > 3) {
        messageInput.style.overflowY = 'scroll';
    } else {
        messageInput.style.overflowY = 'auto';
    }
});

messageElements.forEach(messageElement => {
    messageElement.style.height = 'auto';
    messageElement.style.height = messageElement.scrollHeight + 'px';
});

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
function append(message, position, timestamp) {
// const append = (message, position, timestamp) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.classList.add(position);

    const contentElement = document.createElement('div');
    contentElement.innerText = message;

    const timestampElement = document.createElement('div');
    timestampElement.innerText = timestamp;
    timestampElement.classList.add('timestamp');
    
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timestampElement);

    if (position == 'left') {
        audio.play();
    }

    messageContainer.append(messageElement);
  
};


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// recive the message
socket.on('receive', data =>{
    append(`${data.name}: ${data.message}`, 'left', getCurrentTimestamp());
})


socket.on('user-joined', name => {
    const message = (`${name} joined the chat`);
    append(message, 'right', getCurrentTimestamp());
});

socket.on('left', name => {
    const message = (`${name} left the chat`);
    append(message, 'right', getCurrentTimestamp());
});

function getCurrentTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right', getCurrentTimestamp());
    socket.emit('send', message);
    messageInput.value = ''
})