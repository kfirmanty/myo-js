const ws = new WebSocket("ws://localhost:8490");
ws.onmessage = event => {
    console.log("MSG", event);
};

ws.onopen = () => {
    console.log("REMOTE CONTROL WEBSOCKET OPEN");
};

const switchScene = name => {
    ws.send(JSON.stringify({ type: "switchScene", name }));
};
