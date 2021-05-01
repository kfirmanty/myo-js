const connectToMyoServer = callback => {
    const url = "ws://firmanty.com:8190/";
    const ws = new WebSocket(url);
    ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);
        callback(msg);
    };
};
