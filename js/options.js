class Option extends Scene {
    #fieldName1 = null
    #fieldName2 = null
    #buttonNext = null
    #buttonReset = null
    #imageURL1 = null
    #imageURL2 = null
    #imageList1 = null
    #imageList2 = null
    #sound=null
    //cambiar el imagelist por target list, crear un div ahi individual
    //dentro del target, almacenaremos una imagen y una p para el nombre
    // luego añadimos las cosas con el appendchild.

    constructor(container, next) {
        super(container, next)
        this.#fieldName1 = container.querySelector("#fieldname1")
        this.#fieldName1.addEventListener("keyup", this.#enableNext)
        this.#fieldName2 = container.querySelector("#fieldname2")
        this.#fieldName2.addEventListener("keyup", this.#enableNext)
        this.#imageList1 = container.querySelector("#imageList1")
        this.#imageList2 = container.querySelector("#imageList2")
        this.#buttonNext = container.querySelector("#buttonAceptarConfiguracion")
        this.#sound=container.querySelector(".song");
        this.#buttonNext.addEventListener("click",()=>{
            var options={
                player1: {
                    name: this.#fieldName1.value,
                    url: this.#imageURL1.src,
                },
                player2: {
                    name: this.#fieldName2.value,
                    url: this.#imageURL2.src,
                },
            }
            this._next(options)
        });
        this.#buttonNext.disabled = true;
        this.#buttonReset = container.querySelector("#buttonResetConfiguracion")
        this.#buttonReset.addEventListener("click", this.#reset)
        this.createList()
    }
    createList() {
        fetch("https://rickandmortyapi.com/api/character?page=1")
            .then((response) => response.json())
            .then((data) => {
                // Limpiar listas previas
                imageList1.innerHTML = "";
                imageList2.innerHTML = "";
                let maxImages = Math.min(12, data.results.length);

                for (var i = 0; i < maxImages; i++) {
                    var img1 = document.createElement("img");
                    img1.src = data.results[i].image;
                    img1.alt = data.results[i].name;
                    img1.addEventListener("click", this.#selectImg1);
                    imageList1.appendChild(img1);

                    var img2 = document.createElement("img");
                    img2.src = data.results[i].image;
                    img2.alt = data.results[i].name;
                    img2.addEventListener("click", this.#selectImg2);
                    imageList2.appendChild(img2);
                }
            })
            .catch((error) => console.error("Error al obtener los personajes de Rick and Morty:", error));
    }
    #selectImg1 = () => {
        if (this.#imageURL1 != null) {

            this.#imageURL1.style.border = ""
        }
        this.#imageURL1 = this.#imageList1.querySelector("img:hover")
        this.#imageList1.querySelector("img:hover").style.border = "solid 2px red"
        this.#enableNext()
    }
    #selectImg2 = () => {
        if (this.#imageURL2 != null) {

            this.#imageURL2.style.border = "";
        }
        this.#imageURL2 = this.#imageList2.querySelector("img:hover")
        this.#imageList2.querySelector("img:hover").style.border = "solid 2px red"
        this.#enableNext()
    }
    #reset = () => {
        this.#fieldName1.value = ""
        this.#fieldName2.value = ""
        if (this.#imageURL1 != null) {
            this.#imageURL1.style.border = "none";
        }

        if (this.#imageURL2 != null) {
            this.#imageURL2.style.border = "none";
        }
        this.#imageURL1 = null
        this.#imageURL2 = null
        this.#enableNext()

    }
    #enableNext = () => {
        if (this.#fieldName1.value != "" && this.#fieldName2.value != "" &&
            this.#imageURL1 != null && this.#imageURL2 != null)
            this.#buttonNext.disabled = false
        else
            this.#buttonNext.disabled = true
    }
    start(){
        if(this.#sound!=null){
            this.#sound.play();
        }
    }
    stop(){
        if(this.#sound!=null){
            this.#sound.pause();
        }
    }
    restart(){
    }
}
