const WebSocket = require('ws');
const clients = [];

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('Nova conexão WebSocket estabelecida');

    clients.push(ws);

    ws.on('message', (message) => {
      if (message == 'teste') someEventOnServer();
      console.log('Mensagem recebida do cliente:', JSON.stringify(message));
      setTimeout(() => {
        ws.send('Resposta do servidor: Recebi sua mensagem');
      }, 2000);
    });

    ws.on('close', () => {
      console.log('Conexão WebSocket fechada');

      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
    });
  });
}

function sendToAllClients(message) {
  clients.forEach((client) => {
    client.send(message);
  });
}

function someEventOnServer() {
  const message = 'Esta é uma mensagem enviada do servidor para todos os clientes!';
  sendToAllClients(message);
}

module.exports = createWebSocketServer;
