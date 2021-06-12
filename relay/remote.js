const WebSocket = require("ws");
const HttpsServer = require("https").createServer;
const HttpServer = require("http").createServer;

const DEAFULT_SCENE = {
    redBox: { visible: true },
    blueBox: { visible: false },
    high1Sound: { soundPlaying: true },
    low1Sound: { soundPlaying: true },
    high2Sound: { soundPlaying: false },
    low2Sound: { soundPlaying: false }
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
    let currentScene = DEAFULT_SCENE;

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
        switchScene: ({ scene }) => {
            currentScene = scene;
            console.log("INIT SCENE:", currentScene);
            sendToAll({ type: "initScene", scene: currentScene });
        }
    };
    remoteControlWs.on("open", _ =>
        console.log("remote control server started")
    );
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
        ws.send(JSON.stringify({ type: "initScene", scene: currentScene }));
    });
    remoteControlSslServer.listen(port);
};

exports.startServer = startServer;
