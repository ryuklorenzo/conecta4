class End extends Scene {
    //atributos de la escena
    #sound = null
    //constructor
    constructor(container, next) {
        //llamada constructor clase base
        super(container, next)
        //obteniendo elementos del DOM necesarios para la escena
        //configuración de escuchadores de eventos y asociarlos a métodos internos de la clase
        var portada = container.querySelector("#final");
        var boton_scene1_toscene2 = container.querySelector("#boton_scene4_toscene1");
        boton_scene1_toscene2.addEventListener("click", this._next);
        //inicio del sonido
        this.#sound = container.querySelector(".song");

    }
    /**
     * Implementación método abstrcato
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
     * Implementación método abstrcato
     */
    stop() {
        if (this.#sound != null) {
            this.#sound.pause();
        }
    }
    /**
     * Implementación método abstrcato, no es una buena práctica POO se debería
     * no tener estos casos, pero añade complejidad al desarrollo
     */
    restart() {
    }
}