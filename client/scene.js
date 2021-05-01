const arrToVec = ([x, y, z]) => new THREE.Vector3(x, y, z);
const colorComponentToHex = c => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};

const toHex = (r, g, b) => {
    return (
        "#" +
        colorComponentToHex(r) +
        colorComponentToHex(g) +
        colorComponentToHex(b)
    );
};

const setVal = (id, attribute, val) => {
    const element = document.getElementById(id);
    element.object3D.el.setAttribute(attribute, val);
};

const listeners = [
    listener({
        valueGenerators: [
            onParameter(toRangeConverter(0, 255), orientationPitch)
        ],
        triggerFn: onParameter(triggerConstantly),
        onTrigger: r => setVal("light1", "color", toHex(r, 127, 127))
    }),
    listener({
        valueGenerators: [
            onParameter(toRangeConverter(-10, 10), orientationRoll)
        ],
        triggerFn: onParameter(
            triggerOnThresholdPass(0.4, UP_DIRECTION, 0.01),
            orientationYaw
        ),
        onTrigger: x => setVal("light1", "position", arrToVec(x, 10, 10))
    })
];
