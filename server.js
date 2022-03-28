const express = require('express');
const app = express();
const http = require('http').createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname+ '/index.html');
})


//socket
const io = require('socket.io')(http);

io.on('connection', (socket) => {
    console.log("connected via socket");

    //listen to emited message

    socket.on('message', (msg) => {
        //console.log(msg);
        //broadcast the message to connected clients
        socket.broadcast.emit('message', msg)
    })
});
