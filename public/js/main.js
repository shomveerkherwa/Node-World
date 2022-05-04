//const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const leaveButton = document.getElementById('leave-btn');
const sendButton = document.getElementById('send-btn');
const socket = io()

document.querySelector('emoji-picker')
  .addEventListener('emoji-click', event => console.log(event.detail));

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//join chatroom
socket.emit('joinRoom' , {username, room});

//what to do when i receive a message on client from server
socket.on('message', (receivedMessage) => {
    console.log('received '+receivedMessage);
    outputMessage(receivedMessage);
    
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span> ${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}


sendButton.addEventListener('click', (e) => {
    //e.preventDefault();
    console.log("my actions with text area");
    //getting the value for the element with id msg
    const msg = document.getElementById('msg').value;

    //emitting the chat messgae to server
    socket.emit('chatMessage', msg);

    // clear the input field and focus on it.
    document.getElementById('msg').value = '';
    document.getElementById('msg').focus();
});

// what to do when you receive a message of this type
socket.on('roomUsers', ({room, users}) => {
outputRoomName(room);
outputUsers(users);
});

//add roomName to DOM
function outputRoomName(room){
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}

// what happens when a user clicks leave room
leaveButton.addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the room?');
    if(leaveRoom){
        window.location = '../index.html';
    }
});



