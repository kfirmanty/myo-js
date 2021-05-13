const MYO_FROM = 0;
const MYO_TO = 1;
const MYO_SPAN = MYO_TO - MYO_FROM;

const toRange = (v, from, to) => {
    const newSpan = to - from;
    const percentage = (v - MYO_FROM) / MYO_SPAN;
    return from + newSpan * percentage;
};

AFRAME.registerSystem("myo", {
    schema: { url: { type: "string", default: "ws://localhost:8390" } },

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
            pathFirst == "orientation" ||
            pathFirst == "scale" ||
            pathFirst == "rotation"
        ) {
            this.el.object3D[this.propertyPath[0]][
                this.propertyPath[1]
            ] = value;
        } else {
            this.el.setAttribute.apply(this.el, [...this.propertyPath, value]);
        }
    }
});
