const express = require('express');
const app = express();
// const port = 9216; taken

const counts = {
    red: 0,
    green: 0,
    blue: 0
};

const clients = [];  // a list of connected client response objects

app.post('/click/:color', colorClicked);  // used when a client registers a click
app.get('/clicks', newClient);            // used for a client to request Server-Sent Events
app.listen(port);

// registers a click, and prepares to send updated counts to the clients
function colorClicked(request, response) {
    let color = request.params.color;
    if (color in counts) {
        counts[color]++;
    }
    setTimeout(sendClicks,0);  // abuses setTimeout to call sendClicks after this function ends
    response.end();
}

// sends the current click counts to every connected client in the clients array
function sendClicks() {
    let countsString = JSON.stringify(counts);
    for (let client of clients) {
        client.write('event: counts\n');
        client.write(`data: ${countsString}\n\n`);
    }
}

// initializes new server-side-events configuration
function newClient(request, response) {
    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);

    clients.push(response);
    console.log(clients.length);

    sendClicks(); 

    request.on('close', closeConnection);
    function closeConnection() {
        clients.splice(clients.indexOf(response), 1);  // remove this client from the clients list
        console.log('connection closed');
    }
}