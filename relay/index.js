const WebSocket = require("ws");
const HttpsServer = require("https").createServer;
const fs = require("fs");

const sslServer = HttpsServer({
    cert: fs.readFileSync("/etc/ssl/certs/www_localhost_com.crt"),
    key: fs.readFileSync("/etc/ssl/private/localhost.key")
});

const wsToWeb = new WebSocket.Server({ server: sslServer });
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

sslServer.listen(8390);

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

const remoteControlSslServer = HttpsServer({
    cert: fs.readFileSync("/etc/ssl/certs/www_firmanty_com.crt"),
    key: fs.readFileSync("/etc/ssl/private/firmanty.key")
});

//SERVER FOR REMOTE CONTROL MESSAGES
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
        //console.log("received:", message);
        const msg = JSON.parse(message);
    });
});
remoteControlSslServer.listen(8490);
