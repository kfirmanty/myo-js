const scenes = {
    intro: {
        scene1: { visible: true },
        scene2: { visible: false }
    },
    middle: {
        scene1: { visible: false },
        scene2: { visible: true }
    }
};

const ws = new WebSocket(WSS_REMOTE);
ws.onmessage = event => {
    console.log("MSG", event);
};

ws.onopen = () => {
    console.log("REMOTE CONTROL WEBSOCKET OPEN");
};

const switchScene = name => {
    ws.send(JSON.stringify({ type: "switchScene", scene: scenes[name] }));
};
