const remote = require("./remote.js");
const max = require("./max.js");
const web = require("./web.js");
const fs = require("fs");

const certs = {
    cert: fs.readFileSync("/etc/ssl/certs/www_localhost_com.crt"),
    key: fs.readFileSync("/etc/ssl/private/localhost.key")
};

let webClients = [];
const removeClient = ws => {
    const index = webClients.indexOf(ws);
    if (index > -1) {
        webClients.splice(index, 1);
    }
};

web.startServer({ port: 8390, webClients, removeClient, certs });
max.startServer({ port: 8392, webClients, removeClient });
remote.startServer({ port: 8490, certs });
