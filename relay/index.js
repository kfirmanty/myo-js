const WebSocket = require("ws");

const wsToWeb = new WebSocket.Server({ port: 8190 });
let webClients = [];
const removeClient = ws => {
    const index = webClients.indexOf(ws);
    if (index > -1) {
        webClients.splice(index, 1);
    }
};
wsToWeb.on("connection", ws => {
    webClients.append(ws);
    ws.on("close", () => {
        removeClient(ws);
    });
});

const wsFromMyo = new WebSocket.Server({ port: 8189 });

wsFromMyo.on("connection", ws => {
    ws.on("message", message => {
        webClients.forEach(toClient => {
            try {
                toClient.send(message);
            } catch (e) {
                console.log("ERROR", e, "\nremoving:", toClient);
                removeClient(toClient);
            }
        });
    });
});
