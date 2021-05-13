const WebSocket = require("ws");

const wsToWeb = new WebSocket.Server({ port: 8390 });
let webClients = [];
const removeClient = ws => {
    const index = webClients.indexOf(ws);
    if (index > -1) {
        webClients.splice(index, 1);
    }
};
wsToWeb.on("connection", ws => {
    console.log("CLIENT CONNECTED");
    webClients.push(ws);
    ws.on("close", () => {
        removeClient(ws);
    });
});

const wsFromMyo = new WebSocket.Server({ port: 8391 });

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

//UDP from Max
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

server.on("error", err => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on("message", (msg, rinfo) => {
    console.log(
        "INFO",
        `server got: ${JSON.parse(msg).data} from ${rinfo.address}:${
            rinfo.port
        }`
    );
    const [aX, aY, aZ, gX, gY, gZ, oR, oP, oY] = JSON.parse(msg).data;
    const message = {
        orientation: { roll: oR, pitch: oP, yaw: oY },
        acceleration: { x: aX, y: aY, z: aZ },
        gyro: { x: gX, y: gY, z: gZ }
    };
    webClients.forEach(toClient => {
        try {
            toClient.send(JSON.stringify(message));
        } catch (e) {
            console.log("ERROR", e, "\nremoving:", toClient);
            removeClient(toClient);
        }
    });
});

server.on("listening", () => {
    const address = server.address();
    console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(8392);
