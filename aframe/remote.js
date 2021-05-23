const vecToArr = vec => [vec.x, vec.y, vec.z];
const arrToVec = ([x, y, z]) => new THREE.Vector3(x, y, z);

const showMessage = msg => {
    console.log("SHOW MSG:", msg);
    document.getElementById("messageBoard").setAttribute("value", msg.text);
};

const updateElement = (id, attribute, value) => {
    try {
        const el = document.getElementById(id);
        if (!el) {
            console.log("CREATING ELEMENT:", id);
            let entity = document.createElement("a-entity");
            entity.setAttribute("id", id);
            document.getElementById("scene").appendChild(entity);
        }
        document.getElementById(id).setAttribute(attribute, value);
    } catch (e) {
        console.log("ERROR", e);
    }
};

const removeElement = ({ id }) => {
    try {
        console.log("removing element:", id);
        const el = document.getElementById(id);
        el.parentNode.removeChild(el);
    } catch (e) {
        console.log("ERROR", e);
    }
};

const updateScene = ({ elementId, attribute, value }) => {
    updateElement(elementId, attribute, value);
};

const initScene = ({ scene }) => {
    console.log("INIT SCENE:", scene);
    Object.keys(scene).forEach(id =>
        Object.keys(scene[id]).forEach(attr =>
            updateElement(id, attr, scene[id][attr])
        )
    );
};

const handlers = {
    showMessage,
    updateScene,
    initScene,
    removeElement
};

AFRAME.registerSystem("remote-controller", {
    schema: { url: { type: "string", default: "ws://localhost:8490" } },

    init: function() {
        this.ws = new WebSocket(this.data.url);
        this.ws.onmessage = function(event) {
            const msg = JSON.parse(event.data);
            handlers[msg.type](msg);
        };
    }
});
