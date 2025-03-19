class Juego {
    #escenas = []
    #actual = 0
    #contenedor = null

    constructor(queryCSS) {
        // Selecciona el contenedor principal usando el selector CSS
        this.#contenedor = document.querySelector(queryCSS);
        // Recorre todos los elementos con la clase "scene" dentro del contenedor
        for (const child of this.#contenedor.querySelectorAll(".scene")) {
            // Añade cada escena al array de escenas
            let escena = { _Container: child }; // Almacena el contenedor de la escena
            this.#escenas.push(escena); // Añade la escena al array
        }
        // Actualiza las escenas visibles
        this.#actualizar();

        // Añade eventos a los botones dentro de cada escena
        var boton = document.getElementById("Siguiente");
        if (boton) {
            boton.addEventListener("click", () => this.siguiente());
        }
        boton = document.getElementById("Atras");
        if (boton) {
            boton.addEventListener("click", () => this.anterior());
        }
        boton = document.getElementById("Reiniciar");
        if (boton) {
            boton.addEventListener("click", () => this.reiniciar());
        }
    }


    #actualizar = () => {
        // Actualiza las escenas visibles
        this.#escenas.forEach((element, index) => {
            element._Container.classList.remove("active");
            if (index === this.#actual) {
                element._Container.classList.add("active");
            }
        });

        // Muestra u oculta los botones según la escena activa
        let botonSiguiente = document.getElementById("Sigiente");
        let botonAtras = document.getElementById("Atras");
        let botonReiniciar = document.getElementById("Reiniciar");

        if (this.#actual === this.#escenas.length - 1) {
            // Si es la última escena ("Fin"), solo muestra el botón "Reiniciar"
            if (botonSiguiente) botonSiguiente.style.display = "none";
            if (botonAtras) botonAtras.style.display = "none";
            if (botonReiniciar) botonReiniciar.style.display = "inline-block";
        } else {
            // En otras escenas, muestra u oculta los botones según la lógica normal
            if (botonSiguiente) {
                botonSiguiente.style.display = this.#actual < this.#escenas.length - 1 ? "inline-block" : "none";
            }
            if (botonAtras) {
                botonAtras.style.display = this.#actual > 0 ? "inline-block" : "none";
            }
            if (botonReiniciar) {
                botonReiniciar.style.display = "none";
            }
        }
    };

    siguiente() {
        // Si no es la última escena, avanza a la siguiente
        if (this.#actual < this.#escenas.length - 1) {
            this.#actual++;
        }
        // Actualiza las escenas visibles
        this.#actualizar();
    }

    /**
     * Método para retroceder a la escena anterior
     */
    anterior() {
        // Si no es la primera escena, retrocede a la anterior
        if (this.#actual > 0) {
            this.#actual--;
        }
        // Actualiza las escenas visibles
        this.#actualizar();
    }

    /**
     * Método para reiniciar el juego
     */
    reiniciar() {
        // Vuelve a la primera escena
        this.#actual = 0;
        // Actualiza las escenas visibles
        this.#actualizar();
    }
}
