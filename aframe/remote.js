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
        if (attribute == "soundPlaying") {
            console.log("remote sound:", id, value);
            if (el.components && el.components.sound) {
                value
                    ? el.components.sound.playSound()
                    : el.components.sound.stopSound();
            } else {
                console.log("COULDN'T FIND SOUND COMPONENT FOR:", id);
            }
        } else if (attribute == "videoPlaying") {
            if (el.components && el.components.video) {
                value ? el.components.video.play() : el.components.video.stop();
            } else {
                console.log("COULDN'T FIND VIDEO COMPONENT FOR:", id);
            }
        } else {
            document.getElementById(id).setAttribute(attribute, value);
        }
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

const startAllSounds = () => {
    const sounds = Array.from(document.getElementsByTagName("a-entity"));
    sounds
        .filter(s => s.components.sound)
        .forEach(s => s.components.sound.playSound());
};

const startAllVideos = _ => {
    const videos = document.getElementsByTagName("video");
    for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        try {
            if (v.play) v.play();
        } catch (e) {}
    }
};

const handlers = {
    showMessage,
    updateScene,
    initScene,
    removeElement
};

AFRAME.registerSystem("remote-controller", {
    schema: {},

    init: function() {},
    sceneLoaded: function() {
        console.log("Starting all videos and sounds!");
        startAllSounds();
        startAllVideos();
        this.ws = new WebSocket("ws://localhost:8490");
        this.ws.onmessage = function(event) {
            const msg = JSON.parse(event.data);
            handlers[msg.type](msg);
        };
    }
});
