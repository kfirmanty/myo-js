const WebSocket = require("ws");
const HttpsServer = require("https").createServer;

const startServer = ({ port, certs }) => {
    const remoteControlSslServer = HttpsServer(certs);
    const remoteControlWs = new WebSocket.Server({
        server: remoteControlSslServer
    });
    let remoteControlWebClients = [];
    let scene = {};
    const sendToAll = msg => {
        remoteControlWebClients.forEach(c => c.send(JSON.stringify(msg)));
    };
    const removeRemoteControlClient = ws => {
        const index = remoteControlWebClients.indexOf(ws);
        if (index > -1) {
            remoteControlWebClients.splice(index, 1);
        }
    };
    remoteControlWs.on("connection", ws => {
        console.log("REMOTE CONTROL CLIENT CONNECTED");
        remoteControlWebClients.push(ws);
        ws.on("close", () => {
            removeRemoteControlClient(ws);
        });
        ws.on("message", message => {
            const msg = JSON.parse(message);
            sendToAll(msg);
        });
    });
    remoteControlSslServer.listen(port);
};

exports.startServer = startServer;
