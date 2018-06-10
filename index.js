const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 3000;

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/:room', (req, res) => {
    let room = req.params.room;
    res.sendFile(__dirname + `/public/${room}.html`);
});

//tech namespace
const tech = io.of('/tech');
tech.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room);
        tech.in(data.room).emit('message', `New user joined ${data.room} room`);
    });
    socket.on('message', (data) => {
        console.log('message: ', data.msg);
        tech.in(data.room).emit('message', data.msg);
    });
    socket.on('disconnect', () => {
        let msg = 'user disconnected';
        console.log(msg);
        tech.emit('message', msg);
    });
});