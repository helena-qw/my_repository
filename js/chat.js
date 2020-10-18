const API_URL = 'http://88.198.13.85:8060/';
var stompClient = null;

function getSessionId() {
    return 1;
}

function setConnected(connected) {
    document.getElementById('connect').disabled = connected;
    document.getElementById('disconnect').disabled = !connected;
    document.getElementById('name').disabled = connected;
    document.getElementById('conversationDiv').style.visibility = connected ? 'visible' : 'hidden';
    document.getElementById('conversationDivStop').style.display = connected ? 'block' : 'none';
    document.getElementById('conversationDivStart').style.display = connected ? 'none' : 'block';
    document.getElementById('response').style.display = !connected ? 'none' : 'block';
    
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
    p.innerHTML = `<div class="chat-mess"><br> <strong class="name-mess">${message.from}</strong> <i>${new Date().toLocaleTimeString()}</i><br><div class="mess-mess">${message.payload}</div></div>`;
    response.appendChild(p);
}


 

