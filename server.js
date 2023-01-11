const http = require('http');
const ws = require('ws');

const server = http.createServer((req, res) => {
  res.writeHead(404);
  res.end();
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server running on port ${port}`)
});

const wss = new ws.Server({ server });
const clients = [];
let i = 0;

wss.on('connection', ws => {
  clients.push(ws);

  ws.on('message', message => {
    const msg = JSON.parse(message);
    console.log('message', msg);
    switch (msg.type) {
      case "connect":
        let name = msg.username;
        if (!name) name = "Anonymous";
        if (clients.some(client => client.username === name)) {
          name += i;
          i++;
        }
        ws.username = name;
        const welcomemsg = {
          type: "welcome",
          username: ws.username
        };
        ws.send(JSON.stringify(welcomemsg));
        const newmsg = {
          type: 'newuser',
          username: ws.username
        };
        clients.forEach(client => {
          if (client !== ws) client.send(JSON.stringify(newmsg))
        })
        break;
      case "message":
        msg.username = ws.username;
        clients.forEach(client =>
          client.send(JSON.stringify(msg))
        )
        break;
    }
  });

  ws.on('close', () => {
    clients.splice(clients.indexOf(ws), 1);
  });
});



