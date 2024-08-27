document.addEventListener('DOMContentLoaded', () => {
    const socket = io({ query: { sessionId: document.querySelector('meta[name="csrf-token"]').getAttribute('content') } });
    const loginDiv = document.getElementById('login');
    const chatDiv = document.getElementById('chat');
    const loginButton = document.getElementById('loginButton');
    const sendButton = document.getElementById('sendButton');
    const sessionIdInput = document.getElementById('sessionId');
    const nicknameInput = document.getElementById('nickname');
    const messageInput = document.getElementById('message');
    const messagesDiv = document.getElementById('messages');
    const loginError = document.getElementById('loginError');
    const userListDiv = document.getElementById('userList');

    let nickname = '';

    loginButton.addEventListener('click', () => {
        const sessionId = sessionIdInput.value.trim();
        nickname = nicknameInput.value.trim();

        if (sessionId && nickname) {
            socket.emit('login', { sessionId, nickname });
        }
    });

    socket.on('loginSuccess', () => {
        loginDiv.style.display = 'none';
        chatDiv.style.display = 'flex';
    });

    socket.on('loginError', (error) => {
        loginError.textContent = error;
    });

    sendButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chatMessage', message);
            messageInput.value = '';
        }
    });

    socket.on('chatMessage', (data) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.textContent = `${data.nickname}: ${data.message}`;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });

    socket.on('userJoined', (data) => {
        updateUserList(data.users);
    });

    socket.on('userLeft', (data) => {
        updateUserList(data.users);
    });

    function updateUserList(users) {
        userListDiv.innerHTML = '<h3>Users</h3>';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = user;
            userListDiv.appendChild(userElement);
        });
    }
});
