class Configuracion extends Scene {
    #fieldName1 = null;
    #fieldName2 = null;
    #buttonNext = null;
    #buttonReset = null;
    #imageURL1 = null;
    #imageURL2 = null;
    #imageList1 = null;
    #imageList2 = null;
    #sound = null;

    constructor(container, next) {
        super(container, next);
        this.#fieldName1 = container.querySelector("#fieldname1");
        this.#fieldName2 = container.querySelector("#fieldname2");
        this.#imageList1 = container.querySelector("#imageList1");
        this.#imageList2 = container.querySelector("#imageList2");
        this.#buttonNext = container.querySelector("#buttonAceptarConfiguracion");
        this.#buttonReset = container.querySelector("#buttonResetConfiguracion");
        this.#sound = container.querySelector(".song");

        this.#fieldName1.addEventListener("keyup", this.#enableNext);
        this.#fieldName2.addEventListener("keyup", this.#enableNext);
        this.#buttonNext.addEventListener("click", this.#acceptConfig.bind(this));
        this.#buttonReset.addEventListener("click", this.#reset);
        this.#buttonNext.disabled = true;

        this.#createList();
    }

    async #createList() {
        try {
            const response = await fetch("https://dragonball-api.com/api/characters?page=1&limit=10");
            const data = await response.json();

            this.#imageList1.innerHTML = "";
            this.#imageList2.innerHTML = "";

            data.items.forEach(character => {
                let img1 = document.createElement("img");
                img1.src = character.image;
                img1.addEventListener("click", () => this.#selectImg1(img1));
                this.#imageList1.appendChild(img1);

                let img2 = document.createElement("img");
                img2.src = character.image;
                img2.addEventListener("click", () => this.#selectImg2(img2));
                this.#imageList2.appendChild(img2);
            });
        } catch (error) {
            console.error("Error al obtener los personajes:", error);
        }
    }

    #selectImg1(img) {
        if (this.#imageURL1) this.#imageURL1.classList.remove("selected");
        this.#imageURL1 = img;
        this.#imageURL1.classList.add("selected");
        this.#enableNext();
    }

    #selectImg2(img) {
        if (this.#imageURL2) this.#imageURL2.classList.remove("selected");
        this.#imageURL2 = img;
        this.#imageURL2.classList.add("selected");
        this.#enableNext();
    }

    #reset = () => {
        this.#fieldName1.value = "";
        this.#fieldName2.value = "";
        if (this.#imageURL1) this.#imageURL1.style.border = "none";
        if (this.#imageURL2) this.#imageURL2.style.border = "none";
        this.#imageURL1 = null;
        this.#imageURL2 = null;
        this.#enableNext();
    };

    #enableNext = () => {
        this.#buttonNext.disabled = !(
            this.#fieldName1.value.trim() &&
            this.#fieldName2.value.trim() &&
            this.#imageURL1 &&
            this.#imageURL2
        );
    };

    #acceptConfig() {
        const options = {
            player1: {
                name: this.#fieldName1.value,
                url: this.#imageURL1.src,
            },
            player2: {
                name: this.#fieldName2.value,
                url: this.#imageURL2.src,
            },
        };
        this._next(options);
    }

    start() {
        if (this.#sound) this.#sound.play();
    }

    stop() {
        if (this.#sound) this.#sound.pause();
    }
}