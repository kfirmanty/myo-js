const MYO_FROM = 0;
const MYO_TO = 1;
const MYO_SPAN = MYO_TO - MYO_FROM;
const HOST = "localhost";
const toRange = (v, from, to) => {
    const newSpan = to - from;
    const percentage = (v - MYO_FROM) / MYO_SPAN;
    return from + newSpan * percentage;
};

//mock system version so no additional setup is needed

AFRAME.registerSystem("myo", {
    schema: { url: { type: "string", default: "ws://" + HOST + ":8390" } },

    init: function() {
        this.myoData = {};
        this.phase = 0.0;
    },
    tick: function() {
        const n = (...vals) => {
            const val = vals.reduce((acc, el) => el + acc) / vals.length;
            return (val + 1) / 2;
        };
        const phase = this.phase;
        this.myoData = {
            orientation: {
                pitch: n(Math.sin(phase)),
                roll: n(Math.cos(phase)),
                yaw: n(Math.sin(phase * 5), Math.cos(phase / 3))
            },
            gyro: {
                x: n(Math.cos(phase / 4)),
                y: n(Math.sin(phase * 5)),
                z: n(Math.sin(phase * 3.5), Math.cos(phase / 2.4))
            },
            acceleration: {
                x: n(Math.cos(phase) + Math.sin(phase)),
                y: n(Math.cos(phase * 2.1)),
                z: n(Math.cos(phase / 3))
            }
        };
        this.phase += 0.01;
    },
    getValue: function(name) {
        const [type, property] = name.split(".");
        return this.myoData &&
            this.myoData[type] &&
            this.myoData[type][property]
            ? this.myoData[type][property]
            : 1;
    }
});

/*
AFRAME.registerSystem("myo", {
    schema: { url: { type: "string", default: "ws://" + HOST + ":8390" } },

    init: function() {
        this.ws = new WebSocket(this.data.url);
        this.ws.onmessage = event => {
            const msg = JSON.parse(event.data);
            this.myoData = msg;
        };
    },
    getValue: function(name) {
        const [type, property] = name.split(".");
        return this.myoData &&
            this.myoData[type] &&
            this.myoData[type][property]
            ? this.myoData[type][property]
            : 1;
    }
});
*/
AFRAME.registerComponent("myo", {
    schema: {
        from: { type: "number", default: MYO_FROM },
        to: { type: "number", default: MYO_TO },
        on: { type: "string", default: "orientation.pitch" },
        property: { type: "string", default: "position.x" }
    },
    init: function() {
        this.propertyPath = this.data.property.split(".");
    },
    tick: function() {
        const pathFirst = this.propertyPath[0];
        const value = toRange(
            this.system.getValue(this.data.on),
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
        } else {
            this.el.setAttribute.apply(this.el, [...this.propertyPath, value]);
        }
    }
});
