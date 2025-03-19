class Intro extends Scene {
    #sound = null;

    constructor(container, next) {
        super(container, next);
        this.#sound = container.querySelector("#sonido");
        var siguienteIntro = container.querySelector("#siguienteIntro");

        siguienteIntro.addEventListener("click", this._next);

    }

    start() {
        if (this.#sound) {
            this.#sound.play();
        }
    }

    stop() {
        if (this.#sound) {
            this.#sound.pause();
        }
    }

    restart() {
        if (this.#sound) {
            this.#sound.currentTime = 0;
        }
    }
}