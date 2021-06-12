const maxApi = require("max-api");

const dgram = require("dgram");
const UDP_PORT = 8392;
const HOST = "firmanty.com";

const send = m => {
    const client = dgram.createSocket("udp4");
    const message = Buffer.from(JSON.stringify(m));
    client.send(message, UDP_PORT, HOST, err => {
        //console.log("ERROR", "CLIENT CLOSED", client);
        client.close();
    });
};

maxApi.addHandler("values", (...args) => {
    const [_, ...vals] = args;
    //console.log("VALS", vals);
    send({ data: vals });
});
