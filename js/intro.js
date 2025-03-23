class Intro extends Scene {
    //atributos de la escena
    #sound = null
    //constructor
    constructor(container, next) {
        //llamada constructor clase base
        super(container, next)
        //obteniendo elementos del DOM necesarios para la escena
        //configuración de escuchadores de eventos y asociarlos a métodos internos de la clase
        var portada = container.querySelector("#portada");
        var boton_scene1_toscene2 = container.querySelector("#boton_scene1_toscene2");
        boton_scene1_toscene2.addEventListener("click", () => {
            this._next();
            if (this.#sound != null) {
                this.#sound.play();
            }
        });
        //inicio del sonido
        this.#sound = container.querySelector(".song");
    }
    /**
     * Implementación método abstrcato
     */
    start() {
        // No reproducir el sonido automáticamente
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