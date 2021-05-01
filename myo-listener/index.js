const WebSocket = require("ws");
const windowDsp = require("./window.js");
const dsp = windowDsp.window();

const dataNames = {
    orientation: ["pitch", "roll", "yaw"],
    emg: ["v1", "v2", "v3"],
    accel: ["x", "y", "z"],
    gyro: ["x", "y", "z"]
};

const valueRanges = {
    orientation: { pitch: [-1, 1], roll: [-0.5, 0.5], yaw: [-1, 1] },
    emg: { v1: [-50, 50], v2: [-50, 50], v3: [-50, 50] },
    accel: { x: [-4, 2], y: [-6, 4], z: [-8, 6] },
    gyro: { x: [-1300, 1200], y: [-1000, 1000], z: [-1500, 1000] }
};

const normalize = (category, name, val) => {
    const [from, to] = valueRanges[category][name];
    const span = to - from;
    const normalized = (val - from) / span;
    return Math.min(Math.max(normalized, 0), 1); //clamp to 0,1 range
};

const arrDataToNamed = data => {
    return Object.fromEntries(
        Object.keys(data).map(k => [
            k,
            Object.fromEntries(
                dataNames[k].map((name, i) => [
                    name,
                    normalize(k, name, data[k][i])
                ])
            )
        ])
    );
};

const ws = new WebSocket("ws://www.firmanty.com:8189");

ws.on("open", () => {
    console.log("WS to firmanty.com opened, starting sending values");
    const intervalId = setInterval(() => {
        const namedValues = arrDataToNamed(dsp.getValues());
        ws.send(JSON.stringify({ type: "data", values: namedValues }));
    }, 100);
});

const OSC = require("osc-js");

const options = { send: { port: 11245 } };
const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) });
osc.open({ port: 3000 });

osc.on("open", () => {
    console.log("OPEN");
});

osc.on("/myo/orientation", (message, rinfo) => {
    const [_, roll, pitch, yaw] = message.args;
    dsp.addValues("orientation", [roll, pitch, yaw]);
});

osc.on("/myo/emg", (message, rinfo) => {
    const [_, v1, v2, v3] = message.args;
    dsp.addValues("emg", [v1, v2, v3]);
});

osc.on("/myo/accel", (message, rinfo) => {
    const [_, x, y, z] = message.args;
    dsp.addValues("accel", [x, y, z]);
});

osc.on("/myo/gyro", (message, rinfo) => {
    const [_, x, y, z] = message.args;
    dsp.addValues("gyro", [x, y, z]);
});
