class Juego {
    #escenas = []
    #actual = 0
    #contenedor = null

    constructor(queryCSS) {
        this.#contenedor = document.querySelector(queryCSS);

        for (const child of this.#contenedor.querySelectorAll(".scene")) {
            let escena = { _Container: child };
            this.#escenas.push(escena);
        }

        this.#actualizar();

        // Configurar eventos de botones
        let boton = document.getElementById("Siguiente");
        if (boton) boton.addEventListener("click", () => this.siguiente());

        boton = document.getElementById("Atras");
        if (boton) boton.addEventListener("click", () => this.anterior());

        boton = document.getElementById("Reiniciar");
        if (boton) boton.addEventListener("click", () => this.reiniciar());
    }

    #actualizar = () => {
        this.#escenas.forEach((element, index) => {
            element._Container.classList.remove("active");
            if (index === this.#actual) {
                element._Container.classList.add("active");
            }
        });

        // Obtener los botones
        let botonSiguiente = document.getElementById("Siguiente");
        let botonAtras = document.getElementById("Atras");
        let botonReiniciar = document.getElementById("Reiniciar");

        // Ocultar botón "Siguiente" solo en la última escena
        if (botonSiguiente) {
            botonSiguiente.style.display = (this.#actual === this.#escenas.length - 1) ? "none" : "inline-block";
        }

        if (botonAtras) {
            botonAtras.style.display = this.#actual > 0 ? "inline-block" : "none";
        }

        if (botonReiniciar) {
            botonReiniciar.style.display = this.#actual === this.#escenas.length - 1 ? "inline-block" : "none";
        }
    };

    siguiente() {
        if (this.#actual < this.#escenas.length - 1) {
            this.#actual++;
        }
        this.#actualizar();
    }

    anterior() {
        if (this.#actual > 0) {
            this.#actual--;
        }
        this.#actualizar();
    }

    reiniciar() {
        this.#actual = 0;
        this.#actualizar();
    }
}

