import { Scene } from "./scene.js";
import { Intro } from "./intro.js";
import { End } from "./fin.js";

export class Juego {
    #scenes = [];  // Lista de escenas
    #actual = 0;   // Índice de la escena actual
    #dataplayer1 = null;
    #dataplayer2 = null;

    constructor(queryCSS) {
        this.container = document.querySelector(queryCSS);

        if (!this.container) {
            console.error("No se encontró el contenedor del juego.");
            return;
        }

        // Crear las escenas y asociarlas con sus respectivos contenedores
        for (const child of this.container.querySelectorAll(".scene")) {
            const id = child.getAttribute("id");
            let scene = null;
            
            switch (id) {
                case "scene-intro":
                    scene = new Intro(child, this.next); // Primera escena
                    break;
                case "scene-end":
                    scene = new End(child, this.next); // Última escena
                    break;
            }

            // Si la escena no es nula, agregarla a la lista de escenas
            if (scene != null) {
                this.#scenes.push(scene);
            }
        }

        this.#update(); // Inicializa la escena visible
    }

    /**
     * Actualiza el estado de las escenas (activa la escena actual y desactiva las demás)
     */
    #update = () => {
        this.#scenes.forEach((scene, index) => {
            scene._container.classList.remove("activo");
            scene._container.classList.add("desactivado");
            scene.stop();

            if (index === this.#actual) {
                scene._container.classList.add("activo");
                scene._container.classList.remove("desactivado");
                scene.start();
            }
        });
    }

    /**
     * Cambia a la siguiente escena
     */
    next = () => {
        // Avanza a la siguiente escena, si estamos en la última, volvemos al inicio
        if (this.#actual < this.#scenes.length - 1) {
            this.#actual++;
        } else {
            this.#actual = 0; // Regresamos a la primera escena
        }

        this.#update();
    };

    /**
     * Cambia a la escena anterior
     */
    previus = () => {
        this.#actual > 0 ? this.#actual-- : 0;
        this.#update();
    };
}



