const WebSocket = require("ws");
const HttpsServer = require("https").createServer;

const startServer = ({ port, removeClient, webClients, certs }) => {
    const sslServer = HttpsServer(certs);
    const wsToWeb = new WebSocket.Server({ server: sslServer });
    wsToWeb.on("connection", ws => {
        console.log("CLIENT CONNECTED");
        webClients.push(ws);
        ws.on("close", () => {
            removeClient(ws);
        });
    });
    sslServer.listen(port);
};
