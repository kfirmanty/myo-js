AFRAME.registerComponent("proximity-audio", {
    schema: {
        distance: { type: "int", default: 25 },
        camera: { type: "string", default: "cameraEl" },
        audio: { type: "string", default: "" }
    },
    init: function() {
        this.everyTick = 10;
        this.counter = 0;
        this.cameraEl = document.getElementById(this.data.camera);
        this.audioEl = document.getElementById(this.data.audio);
        this.cameraPosition = new THREE.Vector3();
        this.elementPosition = new THREE.Vector3();
    },
    tick: function() {
        if (this.counter % this.everyTick == 0) {
            this.elementPosition.setFromMatrixPosition(
                this.el.object3D.matrixWorld
            );
            const matrix = this.cameraEl.object3D.matrixWorld;
            this.cameraPosition.setFromMatrixPosition(matrix);
            const distance = Math.abs(
                this.elementPosition.distanceTo(this.cameraPosition)
            );
            //console.log("DISTANCE", distance);
            if (
                distance <= this.data.distance &&
                this.audioEl &&
                this.audioEl.paused
            ) {
                this.audioEl.play();
            } else if (
                distance > this.data.distance &&
                this.audioEl &&
                !this.audioEl.paused
            ) {
                this.audioEl.pause();
            }
        }
        this.counter = (this.counter + 1) % this.everyTick;
    }
});
