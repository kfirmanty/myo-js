const scenes = {
    intro: {
        redBox: { visible: true },
        blueBox: { visible: false },
        high1Sound: { soundPlaying: true },
        low1Sound: { soundPlaying: true },
        high2Sound: { soundPlaying: false },
        low2Sound: { soundPlaying: false }
    },
    middle: {
        redBox: { visible: false },
        blueBox: { visible: true },
        high1Sound: { soundPlaying: false },
        low1Sound: { soundPlaying: false },
        high2Sound: { soundPlaying: true },
        low2Sound: { soundPlaying: true }
    }
}

const ws = new WebSocket("ws://localhost:8490");
ws.onmessage = event => {
    console.log("MSG", event);
};

ws.onopen = () => {
    console.log("REMOTE CONTROL WEBSOCKET OPEN");
};

const switchScene = name => {
    ws.send(JSON.stringify({ type: "switchScene", scene: scenes[name] }));
};
