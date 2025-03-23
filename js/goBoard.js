const CellColor = {
    BLACK: 'black',
    WHITE: 'white',
}

class GoBoard extends Scene {
    #board = null;
    _options = null
    #scoreplayer1 = null
    #scoreplayer2 = null
    #rows = 6
    #cols = 7
    #sound = null;
    //0 negras 1 blancas
    #turn = 0

    constructor(container, next) {
        super(container, next)

        this._options = {
            player1: {
                name: "Player 1",
                url: "./images/musculman.jpg",
            },
            player2: {
                name: "Player 2",
                url: "./images/musculman.jpg",
            }
        }
        this.#sound = container.querySelector(".song");
        //se construye una matriz de rows x colums
        this.#board = Array.from({ length: this.#rows }, () => Array(this.#cols).fill(null));
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

        // Añadir el evento de clic al tablero
        this._container.querySelector("#board").addEventListener("click", this.handleCellClick.bind(this));
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
                //solo la de la izquierda, derecha, arriba y abajo que se encuentren entre los límites
                if ((Math.abs(i) + Math.abs(j) == 1) && row + i >= 0 && row + i < this.#rows - 1 && column + j >= 0 && column + j < this.#cols - 1) {
                    if (this.#isEmpty(this.#board[row + i][column + j])) {
                        atrapado = false
                    } else {
                        //se añade para evaluar si es necesario las que son del mismo color
                        if (this.#getColor(this.#board[row + i][column + j]) == color) {
                            //falta comprobar que no están en la lista
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
            //está rodeado por al menos uno de los suyos que se tiene que evaluar para ver
            //si tiene escapatoria
            if (vecinos_nuevos.length > 0) {
                //alguno está libre
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
                return mergedArray
            } else {
                //no existe ningún vecino y está atrapado, se devuelve el mismo
                return vecinos_color
            }
        }
        //no está atrapado
        return []
    }

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
        return cell != null && cell.childNodes.length == 0;
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
        console.log("Estado del tablero: 0 vacía, 1 jugador 1, 2 jugador 2")
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
        }
    }

    #createBoard() {
        let tableroDiv = this._container.querySelector("#board"); // Busca el tablero dentro del contenedor
        tableroDiv.innerHTML = ''; // Limpia el contenido existente del tablero

        // Crea las celdas del tablero
        for (let fila = 0; fila < this.#rows; fila++) {
            let row = document.createElement("div");
            row.classList.add("row");
            tableroDiv.appendChild(row);
            for (let columna = 0; columna < this.#cols; columna++) {
                let celda = this.#createNode();
                this.#board[fila][columna] = celda;
                row.appendChild(celda);
            }
        }


        // Verificar si hay un ganador
        if (this.verificarVictoria(3, 3)) {
            console.log(`¡El jugador ${this.getTurn() ? 1 : 2} ha ganado!`);
            this.mostrarGanador(); // Llama al método para mostrar al ganador
        }
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
        if (this.#sound != null) {
            this.#sound.play();
        }
    }

    stop() {
        if (this.#sound != null) {
            this.#sound.pause();
        }
    }

    restart() {
        this.#reset()
        this.#createBoard()
    }

    // Método que maneja los clics en las celdas
    handleCellClick(e) {
        if (!e.target.classList.contains("cell")) return;

        console.log("Celda clickeada:", e.target.dataset);

        let columna = parseInt(e.target.dataset.columna, 10);

        // Encuentra la celda más baja disponible en la columna
        for (let fila = this.#rows - 1; fila >= 0; fila--) {
            if (this.#board[fila][columna] === null) {
                this.#set(fila, columna, this.getTurn());
                if (this.verificarVictoria(fila, columna)) {
                    console.log(`¡El jugador ${this.getTurn() ? 1 : 2} ha ganado!`);
                    this.mostrarGanador(); // Llama al método para mostrar al ganador
                    return;
                }
                this.toggleTurn(); // Cambia el turno
                break;
            }
        }
    }

    verificarVictoria(fila, columna) {
        // Implementa la lógica para verificar si hay 4 fichas consecutivas
        // en horizontal, vertical o diagonal
        // ...
        return false; // Cambia esto según la lógica de victoria
    }

    mostrarGanador() {
        // Implementa la lógica para mostrar al ganador
        // ...
    }
}