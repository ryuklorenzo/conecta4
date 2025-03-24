class End extends Scene {
    //atributos de la escena
    #sound = null;

    //constructor
    constructor(container, next) {
        //llamada constructor clase base
        super(container, next);

        // Obteniendo elementos del DOM necesarios para la escena
        var portada = container.querySelector("#final");
        var boton_scene1_toscene2 = container.querySelector("#boton_scene4_toscene1");

        // Verificar si el botón existe antes de agregar el evento
        if (boton_scene1_toscene2) {
            boton_scene1_toscene2.addEventListener("click", this._next);
        } else {
            console.error("El elemento con ID 'boton_scene4_toscene1' no existe en el DOM.");
        }

        // Inicio del sonido
        this.#sound = container.querySelector(".song");
    }

    /**
     * Implementación método abstracto
     */
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

    /**
     * Implementación método abstracto
     */
    stop() {
        if (this.#sound != null) {
            this.#sound.pause();
        }
    }

    /**
     * Implementación método abstracto, no es una buena práctica POO se debería
     * no tener estos casos, pero añade complejidad al desarrollo
     */
    restart() {
        console.log("Método restart ejecutado en End.");
    }
}