const scenes = {
    1: {
        scene1: { visible: true },
        scene2: { visible: false },
        scene3: { visible: false }
    },
    2: {
        scene1: { visible: false },
        scene2: { visible: true },
        scene3: { visible: false }
    },
    3: {
        scene1: { visible: false },
        scene2: { visible: false },
        scene3: { visible: true }
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
