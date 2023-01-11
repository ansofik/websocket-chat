let ws = null;

const connect = () => {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = event => {
    console.log('onopen');
    const message = {
      type: "connect",
      username: document.getElementById("username").value
    };
    ws.send(JSON.stringify(message));
  }

  ws.onmessage = event => {
    console.log('onmessage');
    const message = JSON.parse(event.data);
    console.log('message', message);
    let text = "";
    switch (message.type) {
      case "welcome":
        document.getElementById("namediv").style.display = "none";
        document.getElementById("chatbox").style.display = "block";
        text = `Welcome, ${message.username}`;
        break;
      case "message":
        text = `${message.username}: ${message.text}`;
        break;
      case "newuser":
        text = `User '${message.username}' joined the chat.`;
        break;
    }

    let msgDiv = document.createElement('div');
    msgDiv.textContent = text;
    document.getElementById('messages').prepend(msgDiv);
  }

  ws.onerror = error => {
    console.log('error', error);
  }

  ws.onclose = event => {
    if (event.wasClean) {
      console.log('Connection closed cleanly');
    } else {
      console.log('Connection died');
    }
  }
}

const send = () => {
  const message = {
    type: "message",
    text: document.getElementById("message").value
  };
  ws.send(JSON.stringify(message));
  document.getElementById("message").value = "";
}

const disconnect = () => {
  ws.close();
  document.getElementById("namediv").style.display = "block";
  document.getElementById("chatbox").style.display = "none";
}


