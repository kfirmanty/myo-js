const MYO_FROM = 0;
const MYO_TO = 1;
const MYO_SPAN = MYO_TO - MYO_FROM;
const toRange = (v, from, to) => {
    const newSpan = to - from;
    const percentage = (v - MYO_FROM) / MYO_SPAN;
    return Math.max(Math.min(from + newSpan * percentage, to), from); //make value not go over boundaries in any case
};
const normalize = (...vals) => {
    const val = vals.reduce((acc, el) => el + acc) / vals.length;
    return (val + 1) / 2;
};
const mockData = phase => ({
    orientation: {
        pitch: normalize(Math.sin(phase)),
        roll: normalize(Math.cos(phase)),
        yaw: normalize(Math.sin(phase * 5), Math.cos(phase / 3))
    },
    gyro: {
        x: normalize(Math.cos(phase / 4)),
        y: normalize(Math.sin(phase * 5)),
        z: normalize(Math.sin(phase * 3.5), Math.cos(phase / 2.4))
    },
    acceleration: {
        x: normalize(Math.cos(phase) + Math.sin(phase)),
        y: normalize(Math.cos(phase * 2.1)),
        z: normalize(Math.cos(phase / 3))
    }
});

AFRAME.registerSystem("myo", {
    schema: {
        url: { type: "string", default: WSS_WEB },
        mock: { type: "boolean", default: false }
    },

    init: function() {
        this.ws = new WebSocket(this.data.url);
        this.myoData = {};
        this.ws.onmessage = event => {
            const msg = JSON.parse(event.data);
            this.myoData[msg.name] = msg;
            this.myoData["any"] = msg;
        };
        this.phase = 0.0;
    },
    tick: function() {
        if (this.data.mock) {
            this.myoData["any"] = mockData(this.phase);
            this.phase += 0.01;
        }
    },
    getValue: function(myoName, name) {
        const [type, property] = name.split(".");
        return this.myoData &&
            this.myoData[myoName] &&
            this.myoData[myoName][type] &&
            this.myoData[myoName][type][property]
            ? this.myoData[myoName][type][property]
            : 1;
    }
});

AFRAME.registerComponent("myo", {
    multiple: true,
    schema: {
        from: { type: "number", default: MYO_FROM },
        to: { type: "number", default: MYO_TO },
        on: { type: "string", default: "orientation.pitch" },
        property: { type: "string", default: "position.x" },
        name: { type: "string", default: "any" }
    },
    init: function() {
        this.propertyPath = this.data.property.split(".");
    },
    tick: function() {
        const pathFirst = this.propertyPath[0];
        const value = toRange(
            this.system.getValue(this.data.name, this.data.on),
            this.data.from,
            this.data.to
        );
        if (
            pathFirst == "position" ||
            pathFirst == "scale" ||
            pathFirst == "rotation"
        ) {
            this.el.object3D[this.propertyPath[0]][
                this.propertyPath[1]
            ] = value;
        } else if (pathFirst == "sound") {
            this.el.setAttribute.apply(this.el, [...this.propertyPath, value]);
        } else if (pathFirst == "video") {
            const videoId = this.el.id.replace("-disp", "");
            document.getElementById(videoId)[this.propertyPath[1]] = value;
            //this.el.setAttribute.apply(this.el, [...this.propertyPath, value]);
        } else {
            this.el.setAttribute.apply(this.el, [...this.propertyPath, value]);
        }
    }
});
