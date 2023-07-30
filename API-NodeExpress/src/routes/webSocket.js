const WebSocket = require('ws');
const DeviceMedia = require("../models/deviceMedia");
const Media = require("../models/media");
const Device = require("../models/device");
const clients = [];

function createWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', handleConnection);

  function handleConnection(ws) {
    console.log('Nova conexão WebSocket estabelecida');

    clients.push(ws);

    ws.on('message', (message) => handleMessage(ws, message));
    ws.on('close', handleClose);
  }

  async function handleMessage(ws, message) {
    try {
      const parsedMessage = JSON.parse(message);
      console.log('Mensagem recebida do cliente:', parsedMessage);

      switch (parsedMessage.type) {
        case 'subscribe':
          await handleSubscribeMessage(ws, parsedMessage);
          break;
        default:
          ws.send(`Mensagem não reconhecida! ${JSON.stringify(parsedMessage)}`);
          break;
      }
    } catch (error) {
      console.error('Erro ao analisar a mensagem:', error);
      ws.send('Erro ao analisar a mensagem. Certifique-se de que o formato JSON seja válido.');
    }
  }

  async function handleSubscribeMessage(ws, parsedMessage) {
    const { serialNumber } = parsedMessage;
    const device = await Device.findOne({ where: { serialNumber } });

    if (!device) {
      ws.send('Dispositivo não encontrado!');
      return;
    }

    const deviceMedia = await DeviceMedia.findAll({
      where: { deviceId: device.id },
      include: [{ model: Media }],
    });

    const response = deviceMedia.map((item) => ({
      mediaName: item.Media.name,
      mediaUrl: item.Media.url.toString(),
      mediaTime: item.time,
    }));

    ws.send(JSON.stringify(response));
  }

  function handleClose() {
    console.log('Conexão WebSocket fechada');
    const index = clients.indexOf(this);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  }
}

module.exports = createWebSocketServer;
