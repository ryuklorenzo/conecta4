const CellColor = {
    BLACK: 'back',
    WHITE: 'white',
}

class GoBoard extends Scene {
    #board = null;
    _options = null
    #scoreplayer1 = null
    #scoreplayer2 = null
    #rows = 19
    #cols = 19
    #sound=null;
    //0 negras 1 blancas
    #turn = 0

    constructor(container, next) {
        super(container, next)

        this._options = {
            player1: {
                name: "Player 1",
                url: "./images/icons8-rick-sanchez-480.png",
            },
            player2: {
                name: "Player 2",
                url: "./images/icons8-rick-sanchez-480.png",
            }
        }
        this.#sound=container.querySelector(".song");
        //se construye una matriz de rows x colums
        this.#board = Array.from({length: this.#rows}, () => Array(this.#cols).fill(null));
        //configurar el boton de reset
        this._container.querySelector("#resetBoard").addEventListener("click", () => {
            this.#reset()

        })
        this._container.querySelector("#printBoard").addEventListener("click", () => {
            this.#print()

        })
        this._container.querySelector("#evalBoard").addEventListener("click", () => {
            this.#evalBoard()

        })
        this.#scoreplayer1 = this._container.querySelector("#infoPlayer1 .scorePlayer")
        this.#scoreplayer2 = this._container.querySelector("#infoPlayer2 .scorePlayer")

    }

    setOptions(options) {
        this._options = options

        //no se debe hacer, se realiza como ejemplo
        this._container.querySelector("#infoPlayer1 .nombrePlayer").innerHTML = options.player1.name
        this._container.querySelector("#infoPlayer1 .imagenPlayer img").src = options.player1.url

        //no se debe hacer, se realiza como ejemplo
        this._container.querySelector("#infoPlayer2 .nombrePlayer").innerHTML = options.player2.name
        this._container.querySelector("#infoPlayer2 .imagenPlayer img").src = options.player2.url
    }

    #changeColor(row, column) {
        var nodo = this.#board[row][column].childNodes[0]
        if (nodo.classList.contains("circle_playerOne")) {
            nodo.style.backgroundImage = "url('" + this._options.player2.url + "')";
            nodo.classList.add("circle_playerTwo")
            nodo.classList.remove("circle_playerOne")
        } else {
            nodo.style.backgroundImage = "url('" + this._options.player1.url + "')";
            nodo.classList.add("circle_playerOne")
            nodo.classList.remove("circle_playerTwo")
        }
    }

    #clearCell(row, column) {
        var nodo = this.#board[row][column]
        nodo.removeChild(nodo.firstChild)
        /* if (nodo.classList.contains("circle_playerOne")) {
             nodo.style.backgroundImage = "url('" + this._options.player2.url + "')";
             nodo.classList.add("circle_playerTwo")
             nodo.classList.remove("circle_playerOne")
         } else {
             nodo.style.backgroundImage = "url('" + this._options.player1.url + "')";
             nodo.classList.add("circle_playerOne")
             nodo.classList.remove("circle_playerTwo")
         }*/
    }

    #evalBoard() {
        for (var i = 0; i < this.#rows; i++) {
            for (var j = 0; j < this.#cols; j++) {
                if (this.#board[i][j] != null && !this.#isEmpty(this.#board[i][j])) {
                    var resultado = this.#evalCell(i, j, [[i, j]])
                    console.log(resultado)
                    //si devuelve una lista con algún elemento, se cambia de color
                    if (resultado.length > 0) {
                        resultado.forEach((coord) => {
                            this.#clearCell(coord[0], coord[1])
                        })
                    }
                }

            }
        }
        var score = this.#countBoard();
        this.#scoreplayer1.innerHTML = score[0]
        this.#scoreplayer2.innerHTML = score[1]
    }
    
    #evalCell(row, column, vecinos_color) {
        var atrapado = true
        let vecinos_nuevos = []
        var color = this.#getColor(this.#board[row][column])
        //en el momento que existe una libre se para
        for (var i = -1; i <= 1 && atrapado; i++)
            for (var j = -1; j <= 1 && atrapado; j++) {
                //solo la de la izquierda, derecha, arriba y abajo que se encuentren entre los ímites
                if ((Math.abs(i) + Math.abs(j) == 1) && row + i >= 0 && row + i < this.#rows - 1 && column + j >= 0 && column + j < this.#cols - 1) {
                    if (this.#isEmpty(this.#board[row + i][column + j])) {
                        atrapado = false
                    } else {
                        //se añade para evaluar si es necesario las que son del mismo color
                        if (this.#getColor(this.#board[row + i][column + j]) == color) {
                            //falta comprobar que no estan en la lista
                            var coords = [row + i, column + j]
                            if (!vecinos_color.some(([x, y]) => x === coords[0] && y === coords[1])) {
                                vecinos_nuevos.push(coords)

                            }
                        }
                    }
                }
            }
        this.#board[row][column].childNodes[0].classList.add("red")
        //nuevas celdas evaluadas
        let nuevos = []
        if (atrapado) {
            //esta rodeado por al meno uno de los suyos que se tiene que evaluar para ver
            //si tiene escapatoria
            if (vecinos_nuevos.length > 0) {
                //alguno esta libre
                for (var i = 0; i < vecinos_nuevos.length; i++) {
                    var cell = vecinos_nuevos[i]
                    //llamada recursiva
                    var libre = this.#evalCell(cell[0], cell[1], vecinos_color.concat([cell]))
                    if (libre.length == 0) {
                        atrapado = false
                        return []
                    } else {
                        //se añade a los conectados
                        nuevos = nuevos.concat(libre)

                    }
                }
                //en este punto no se ha encontrado nada libre, se añaden y se devuelven
                //si llega a la llamada principal, se cambia de color
                var mergedArray = [...new Set([...vecinos_nuevos, ...vecinos_color, ...nuevos])]
                return mergedArray //vecinos_color.concat(nuevos).concat(vecinos_nuevos)
            } else {
                //no existe ningun vecino y está atrapado, se devuelve el mismo
                return vecinos_color
            }
        }
        //no esta atrapado
        return []
    }


    /**
     * devuelve un vector de 2 elementos con indice 0 -> negras, 1 blancas
     *
     */
    #countBoard() {
        var score = [0, 0]
        for (var i = 0; i < this.#rows; i++) {
            for (var j = 0; j < this.#cols; j++) {
                if (this.#board[i][j] != null && !this.#isEmpty(this.#board[i][j])) {
                    if (this.#getColor(this.#board[i][j]) == CellColor.BLACK)
                        score[0]++;
                    else
                        score[1]++;
                }

            }
        }
        return score
    }

    #isEmpty(cell) {
        if (cell != null && cell.childNodes.length == 0)
            return true
        else
            return false;
    }

    #getColor(cell) {

        if (cell.childNodes[0].classList.contains("circle_playerOne"))
            return CellColor.BLACK
        else
            return CellColor.WHITE
    }


    getTurn() {
        return this.#turn
    }

    toggleTurn() {
        this.#turn = !this.#turn
    }

    #set(row, column, value) {
        var node = this.#board[row][column]
        //evita que se coloque en una que ya tiene una ficha
        if (!node.classList.contains("circle")) {
            var circle = document.createElement("div")
            circle.classList.add("circle")
            if (value) {
                circle.style.backgroundImage = "url('" + this._options.player1.url + "')";
                circle.classList.add("circle_playerOne")

            } else {
                circle.style.backgroundImage = "url('" + this._options.player2.url + "')";
                circle.classList.add("circle_playerTwo")
            }
            //cambio de turno y añadir al elemento

            node.appendChild(circle)
        }
    }

    #createNode() {
        var nodo = document.createElement("div")
        nodo.classList.add("cell")
        nodo.addEventListener("click", (event) => {
            var node = event.target
            //evita que se coloque en una que ya tiene una ficha
            if (!node.classList.contains("circle")) {
                var circle = document.createElement("div")
                circle.classList.add("circle")
                if (this.getTurn()) {
                    circle.style.backgroundImage = "url('" + this._options.player1.url + "')";
                    circle.classList.add("circle_playerOne")

                } else {
                    circle.style.backgroundImage = "url('" + this._options.player2.url + "')";
                    circle.classList.add("circle_playerTwo")
                }
                //cambio de turno y añadir al elemento
                this.toggleTurn();
                node.appendChild(circle)
            }

        })
        return nodo
    }

    #print() {
        console.log("Estado del tablero: 0 vacia, 1 jugador 1, 2 jugador 2")
        for (var i = 0; i < this.#rows; i++) {
            var row = " FILA (" + (i < 10 ? " " : "") + i + ")";
            //se crean las columnas
            for (var j = 0; j < this.#cols; j++) {
                if (this.#board[i][j] == null || this.#board[i][j].childNodes.length == 0)
                    row += " 0";
                else if (this.#board[i][j].childNodes[0].classList.contains("circle_playerOne"))
                    row += " 1";
                else
                    row += " 2";
            }
            console.log(row)
            row = "";
        }
    }

    #createBoard() {
        var nodo;
        //se crea la fina
        for (var i = 0; i < this.#rows; i++) {
            var row = document.createElement("div")
            row.classList.add("row")
            document.getElementById("board").appendChild(row)
            //se crean las columnas
            for (var j = 0; j < this.#cols; j++) {
                nodo = this.#createNode()
                //se almacena para ser evaluado
                this.#board[i][j] = nodo
                row.appendChild(nodo)
            }

        }
        //para probar
        this.#set(1, 1, true)
        this.#set(1, 0, false)
        this.#set(0, 1, false)
        this.#set(2, 1, true)
        this.#set(1, 2, false)
        this.#set(2, 0, false)
        this.#set(2, 2, false)
        this.#set(3, 0, false)
        this.#set(3, 1, true)
        this.#set(3, 2, true)
        this.#set(4, 0, false)
        this.#set(4, 1, false)
        this.#set(4, 2, false)
        this.#set(3, 3, false)

    }


    #reset = () => {
        this.#turn = false;
        for (var i = 0; i < this.#rows; i++) {
            for (var j = 0; j < this.#cols; j++) {

                if (this.#board[i][j] != null && this.#board[i][j].childNodes.length > 0) {
                    this.#board[i][j].removeChild(this.#board[i][j].firstChild)
                }
            }
        }
    }

    start() {
        this.#reset()
        this.#createBoard();
        if(this.#sound!=null){
            this.#sound.play();
        }
    }

    stop() {
        if(this.#sound!=null){
            this.#sound.pause();
        }
    }

    restart() {
        this.#reset()
        this.#createBoard()
    }
}

