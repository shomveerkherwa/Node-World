const socket = io()

let naam;

// get the element
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')


// force user to enter a name, or keep promting until there is an input.
do{
    naam = prompt('Please Enter your name');
} while(!naam)

// trigger this event when a key is pressed
textarea.addEventListener('keyup', (e)=> {
    // check if enter key was pressed
    if(e.key === 'Enter') {
        // get the content of text area
        sendMessage(e.target.value)
    }
})

function sendMessage(typedMessage) {
    // format the message by adding username and message body
    let msg = {
        user: naam,
        message:typedMessage.trim()
    }

    //emit the message to server
    socket.emit('message', msg)

    //append the newly types message in the html before sending to server.
    appendMessage(msg, 'outgoing')
    // clean text area
    textarea.value = ''
    scrollToBottom()
}

function appendMessage(msg, type){
    let mainDiv = document.createElement('div')
    let className = type // incoming or outgoing
    mainDiv.classList.add(className, 'message')

    let markup = `
        <h4> ${msg.user} </h4>
        <p> ${msg.message} </p>
    `

    mainDiv.innerHTML = markup
    messageArea.appendChild(mainDiv)
}

function scrollToBottom() {
    messageArea.scrollTop = messageArea.scrollHeight
}

// receive message
socket.on('message', (msg) => {
    console.log(msg);
    appendMessage(msg, 'incoming')
    scrollToBottom()
})