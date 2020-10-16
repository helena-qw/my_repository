const API_URL = 'http://195.250.62.211:8030';
var stompClient = null;

function getSessionId() {
    return 1;
}

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('name').disabled = connected;
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('response').innerHTML = '';
}

function connect() {
    const socket = new SockJS(`${API_URL}/chat`);
    stompClient = Stomp.over(socket);
    stompClient.connect({}, frame => {
        setConnected(true);
        const sessionId = getSessionId();
        console.log(`Connected [session id = ${sessionId}] : `, frame);
        stompClient.subscribe(`/topic/chat/${sessionId}`, message => {
            message = JSON.parse(message.body);
            showMessage(message);
        });
    });
}

function disconnect() {
    stompClient.disconnect();
    setConnected(false);
    console.log("Disconnected");
}

function sendMessage() {
    const sessionId = getSessionId();
    const name = document.getElementById('name').value;
    const message = document.getElementById('message').value;
    document.getElementById('message').value = '';
    stompClient.send(`/app/chat/${sessionId}`, {}, JSON.stringify({from: name, payload: message}));
}

function showMessage(message) {
    const response = document.getElementById('response');
    const p = document.createElement('p');
    p.style.wordWrap = 'break-word';
    p.innerHTML = `<strong>${message.from}</strong> <i>${new Date().toLocaleTimeString()}</i><br>${message.payload}`;
    response.appendChild(p);
}
