const remote = require("./remote.js");
const max = require("./max.js");
const web = require("./web.js");
const fs = require("fs");
const constants = require("../constants.js");

const certs = constants.USE_SSL
    ? {
          cert: fs.readFileSync("/etc/ssl/certs/www_firmanty_com.crt"),
          key: fs.readFileSync("/etc/ssl/private/firmanty.key")
      }
    : {};

let webClients = [];
const removeClient = ws => {
    const index = webClients.indexOf(ws);
    if (index > -1) {
        webClients.splice(index, 1);
    }
};

web.startServer({
    port: constants.WSS_WEB_PORT,
    webClients,
    removeClient,
    certs
});
max.startServer({ port: constants.UDP_MAX_PORT, webClients, removeClient });
remote.startServer({ port: constants.WSS_REMOTE_PORT, certs });
