const WebSocket = require('ws');

// WebSocket server for guides
const guidesWSS = new WebSocket.Server({ port: 8081 });

// WebSocket server for tourists
const touristsWSS = new WebSocket.Server({ port: 8082 });

// Function to broadcast a message to all clients of a WebSocket server
const broadcast = (wss, data) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

guidesWSS.on('connection', (ws) => {
    ws.on('message', (data) => {
        // Relay message to tourist WebSocket server
        broadcast(touristsWSS, data);
    });
});

touristsWSS.on('connection', (ws) => {
    ws.on('message', (data) => {
        // Relay message to guide WebSocket server
        broadcast(guidesWSS, data);
    });
});

console.log('Guide WebSocket server is running on port 8081');
console.log('Tourist WebSocket server is running on port 8082');