const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const crypto = require('crypto');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const sessionId = crypto.randomBytes(16).toString('hex');
const users = new Set();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

io.use((socket, next) => {
    const sessionId = socket.handshake.query.sessionId;
    if (sessionId) {
        next();
    } else {
        next(new Error('Invalid Session ID'));
    }
});

io.on('connection', (socket) => {
    let currentUser = '';

    socket.on('login', (data) => {
        if (data.sessionId === sessionId) {
            currentUser = data.nickname.trim().replace(/<[^>]+>/g, '');
            users.add(currentUser);
            socket.emit('loginSuccess');
            io.emit('userJoined', { users: Array.from(users) });
        } else {
            socket.emit('loginError', 'Invalid Session ID');
        }
    });

    socket.on('chatMessage', (message) => {
        const sanitizedMessage = message.trim().replace(/<[^>]+>/g, '');
        io.emit('chatMessage', { nickname: currentUser, message: sanitizedMessage });
    });

    socket.on('disconnect', () => {
        if (currentUser) {
            users.delete(currentUser);
            io.emit('userLeft', { users: Array.from(users) });
        }
    });
});

const port = process.argv[2] || 3000;
server.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
    console.log(`Session ID: ${sessionId}`);
});
