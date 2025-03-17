class Intro extends Scene {
    #sound = null
    constructor(container, next) {
        super(container, next)
        var portada = container.querySelector("#portada");
        var boton_scene1_toscene2 = container.querySelector("#boton_scene1_toscene2");
        boton_scene1_toscene2.addEventListener("click", this._next);
        this.#sound = container.querySelector(".song");

    }
    start() {
        /*
        Chrome: chrome://settings/content/sound
        Firefox: about:config y buscar media.autoplay.default
        Edge: edge://settings/content/mediaAutoplay
         */
        if (this.#sound != null) {
            this.#sound.play();
        }
    }
    stop() {
        if (this.#sound != null) {
            this.#sound.pause();
        }
    }
    restart() {
    }
}