import { Scene } from "./scene.js";

export class Intro extends Scene {
    #sound = null;

    constructor(container, next) {
        super(container, next);

        const boton = container.querySelector("#boton_scene1_toscene2");
        if (boton) {
            boton.addEventListener("click", () => {
                console.log("Cambiando a la siguiente escena...");
                this._next();  // Cambiar a la siguiente escena
            });
        }

        this.#sound = container.querySelector(".song");
    }

    start() {
        if (this.#sound) {
            this.#sound.play();
        }
        this._container.classList.add("activo");
        this._container.classList.remove("desactivado");
    }

    stop() {
        if (this.#sound) {
            this.#sound.pause();
        }
        this._container.classList.remove("activo");
        this._container.classList.add("desactivado");
    }

    restart() {
        this.stop();
        this.start();
    }
}

