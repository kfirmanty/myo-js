const USE_SSL = true;
const WSS_HOST = "wss://firmanty.com";
const WSS_WEB_PORT = 8390;
const WSS_WEB = WSS_HOST + ":" + WSS_WEB_PORT;
const WSS_REMOTE_PORT = 8490;
const WSS_REMOTE = WSS_HOST + ":" + WSS_REMOTE_PORT;

const UDP_MAX_PORT = 8392;

module
    ? (module.exports = {
          USE_SSL,
          WSS_HOST,
          WSS_WEB_PORT,
          WSS_WEB,
          WSS_REMOTE_PORT,
          WSS_REMOTE,
          UDP_MAX_PORT
      })
    : null;
