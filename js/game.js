class Game {
    //array de escenas
    #scenes = []
    #actual = 0
    //para pruebas de funcioanmiento
    //#nextButton = null
    //#previusButton = null
    #container = null
    #dataplayer1 = null
    #dataplayer2 = null

    /**
     * se le pasa el contenedor en que se creara el juego
     * crea y añade al array asociativo scenes las diferentes escenas
     * @param queryCSS
     */
    constructor(queryCSS) {
        this.container = document.querySelector(queryCSS)
        for (const child of this.container.querySelectorAll(".scene")) {
            var id = child.getAttribute("id")
            var scene = null;
            switch (id) {
                case "intro":
                    scene = new Intro(child, this.next)
                    break;
                case "config":
                    scene = new Option(child, (options) => {
                        this.#dataplayer1 = options.player1
                        this.#dataplayer2 = options.player2
                        this.next()
                    })
                    break;
                case "boardContainer":
                    scene = new GoBoard(child, this.next, {
                        player1: this.#dataplayer1,
                        player2: this.#dataplayer2,
                    })
                    break;
                case "end":
                    scene = new End(child, this.next)
                    break;
            }
            //se añaden al array asociativo/lista
            if (scene != null)
                this.#scenes.push(scene)
            this.#update()
        }
    }

    /**
     * método privado #, cambia a visible/no visible las diferentes escenas
     */
    #update = () => {
        this.#scenes.forEach((element, index) => {
            element._container.classList.remove("active");
            if (index == this.#actual) {
                element._container.classList.add("active");
                element.start()
            } else {
                element.stop()
            }
        });
    }

    /**
     * funcionles lambda (almacenado en variable) que cambia la escena actual
     */
    previus = () => {
        this.#actual > 0 ? this.#actual-- : 0;
        this.#update()
    };

    /**
     * funcionles lambda (almacenado en variable) que cambia la escena actual
     */
    next = () => {
        //en bucle
        if (this.#actual < (this.#scenes.length - 1))
            this.#actual++;
        else
            this.#actual = 0;
        this.#update()
    }
}