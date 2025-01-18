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
    const fileInput = document.getElementById('fileInput');
    const uploadButton = document.getElementById('uploadButton');

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

    uploadButton.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);

            fetch('/upload', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                fileInput.value = '';
            })
            .catch(error => {
                console.error('Cant upload file:', error);
            });
        }
    });

    socket.on('fileMessage', (data) => {
        const fileElement = document.createElement('div');
        fileElement.classList.add('file');

        const link = document.createElement('a');
        link.href = `data:${data.filetype};base64,${data.data}`;
        link.download = data.filename;
        link.textContent = `${data.filename}`;

        fileElement.appendChild(link);
        messagesDiv.appendChild(fileElement);
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