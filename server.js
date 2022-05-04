const express = require('express');
const app = express();
const server = require('http').createServer(app);
//socket
const io = require('socket.io')(server);

// internal modules
const formatMessage = require('./util/messages'); 
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./util/users'); 

const appName = 'Admin';
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

// set static folder
app.use(express.static(__dirname + '/public'))

//app.get('/', (req, res) => {
//    res.sendFile(__dirname+ '/index.html');
//})

//run when a client connects 
io.on('connection', (socket) => {
    console.log("connected via socket on server");
    
        socket.on('joinRoom', ({username, room}) => {
        const user = userJoin(socket.id, username, room)
        
        // inbuilt socket function to join a room
        socket.join(user.room);

        //welcome the current user
        socket.emit('message', formatMessage(appName, 'Welcome to chatcord'));
    
        // broadcasts when a client connects
        socket.broadcast
            .to(user.room)
            .emit(
                'message', 
                formatMessage(appName, `${user.username} has joined the chat`)
                );

        // send the details of room and other connected users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    
    

    
    //listen to emited message
    socket.on('chatMessage', receivedMessage => {
        const user = getCurrentUser(socket.id);
        io
          .to(user.room)
          .emit('message', formatMessage(user.username, receivedMessage));
    });


    //broadcast when a client disconnects
    socket.on('disconnect', () =>{
        const user = userLeave(socket.id);
        if(user){
            io
            .to(user.room)
            .emit('message', formatMessage(appName, `${user.username} has left the chat`));
        
        // update the new list of users
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        
        }
    });

    socket.on('message', (msg) => {
        console.log('old '+msg);
        //broadcast the message to connected clients
    //    socket.broadcast.emit('message', msg)
    })
});
