//UDP from Max
const dgram = require("dgram");
const server = dgram.createSocket("udp4");

const startServer = ({ port, removeClient, webClients }) => {
    console.log("starting max server on port:", port);
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

    server.bind(port);
};

exports.startServer = startServer;
