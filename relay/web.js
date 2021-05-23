const WebSocket = require("ws");
const HttpsServer = require("https").createServer;
const HttpServer = require("http").createServer;

const startServer = ({ port, removeClient, webClients, certs }) => {
    console.log("starting web facing websocket on port:", port);
    const sslServer = certs.cert ? HttpsServer(certs) : HttpServer();
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

exports.startServer = startServer;
