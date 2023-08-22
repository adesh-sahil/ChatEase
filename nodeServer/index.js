// Node server which will handle socket io connections
const io = require('socket.io')(process.env.PORT || 8000);

const users = {};

io.on('connection', socket =>{
    // If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{ 
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        const timestamp = new Date().toLocaleTimeString();
        socket.broadcast.emit('receive', {message: message, name: users[socket.id], timestamp: timestamp  })
    });

    // If someone leaves the chat, let others know 
    // socket.on('disconnect', message =>{
    //     socket.broadcast.emit('left', users[socket.id]);
    //     delete users[socket.id];
    // });
    socket.on('disconnect', () => {
        const disconnectedUser = users[socket.id];
        socket.broadcast.emit('left', disconnectedUser);
        delete users[socket.id];
    });

})
