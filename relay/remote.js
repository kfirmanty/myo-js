const WebSocket = require("ws");
const HttpsServer = require("https").createServer;
const HttpServer = require("http").createServer;

const SCENE_DEFAULTS = {
    intro: {
        redBox: { visible: true },
        blueBox: { visible: false }
    },
    middle: {
        redBox: { visible: false },
        blueBox: { visible: true }
    }
};

const startServer = ({ port, certs }) => {
    console.log("starting remote control server on port:", port);
    const remoteControlSslServer = certs.cert
        ? HttpsServer(certs)
        : HttpServer();
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

    const internalHandlers = {
        switchScene: ({ name }) => {
            if (SCENE_DEFAULTS[name]) {
                scene = SCENE_DEFAULTS[name];
                console.log("INIT SCENE:", scene);
                sendToAll({ type: "initScene", scene });
            } else {
                console.log("UNKNOWN SCENE NAME:", name);
            }
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
            console.log("MSG:", msg);
            if (internalHandlers[msg.type]) {
                internalHandlers[msg.type](msg);
            } else {
                sendToAll(msg);
            }
        });
    });
    remoteControlSslServer.listen(port);
};

exports.startServer = startServer;
