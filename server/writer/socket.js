const WebSocket = require('ws');
const wsPort = 9113;

const webSocketServer = new WebSocket.Server({ port: wsPort });
webSocketServer.on('connection', newConnection);

function newConnection(websocket) {
    console.log('new connection');
    websocket.on('message', messageReceived);

    function messageReceived(data) {
        console.log('received: ' + data);
        websocket.send('you sent ' + data);
    }
}