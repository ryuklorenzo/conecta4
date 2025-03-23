class GoBoard extends Scene {
    #board = null;
    _options = null;
    #scoreplayer1 = null;
    #scoreplayer2 = null;
    #rows = 6; // Número de filas
    #cols = 7; // Número de columnas
    #sound = null;
    #turn = 0; // 0: Jugador 1, 1: Jugador 2

    constructor(container, next) {
        super(container, next);

        this._options = {
            player1: {
                name: "Player 1",
                url: "./images/musculman.jpg",
            },
            player2: {
                name: "Player 2",
                url: "./images/musculman.jpg",
            },
        };

        this.#sound = container.querySelector(".song");
        this.#board = Array.from({ length: this.#rows }, () => Array(this.#cols).fill(null));

        // Configurar botones
        this._container.querySelector("#resetBoard").addEventListener("click", () => {
            this.#reset();
        });

        this._container.querySelector("#printBoard").addEventListener("click", () => {
            this.#print();
        });

        this.#scoreplayer1 = this._container.querySelector("#infoPlayer1 .scorePlayer");
        this.#scoreplayer2 = this._container.querySelector("#infoPlayer2 .scorePlayer");
    }

    #createNode(row, col) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;

        cell.addEventListener("click", () => {
            this.#handleCellClick(row, col);
        });

        return cell;
    }

    #createBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = ""; // Limpiar el tablero
    
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                const cell = this.#createNode(i, j);
                this.#board[i][j] = null; // Inicializar la celda como vacía
                boardElement.appendChild(cell); // Agregar la celda directamente al tablero
            }
        }
    }

    #handleCellClick(row, col) {
        // Buscar la primera fila disponible en la columna
        for (let i = this.#rows - 1; i >= 0; i--) {
            if (!this.#board[i][col]) {
                this.#board[i][col] = this.#turn === 0 ? "circle_playerOne" : "circle_playerTwo";
                this.#updateBoard();

                if (this.#checkWinner(i, col)) {
                    alert(`${this.#turn === 0 ? this._options.player1.name : this._options.player2.name} gana!`);
                    this.#reset();
                    return;
                }

                this.#turn = 1 - this.#turn; // Cambiar turno
                return;
            }
        }

        alert("¡Columna llena!");
    }

    #updateBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            const row = Number(cell.dataset.row);
            const col = Number(cell.dataset.col);
            cell.className = "cell"; // Resetear clases

            if (this.#board[row][col]) {
                cell.classList.add(this.#board[row][col]);
                cell.style.backgroundImage = `url('${this.#board[row][col] === "circle_playerOne" ? this._options.player1.url : this._options.player2.url}')`;
            }
        });
    }

    #checkWinner(row, col) {
        const color = this.#turn === 0 ? "circle_playerOne" : "circle_playerTwo";

        return (
            this.#checkDirection(row, col, 1, 0, color) || // Vertical
            this.#checkDirection(row, col, 0, 1, color) || // Horizontal
            this.#checkDirection(row, col, 1, 1, color) || // Diagonal \
            this.#checkDirection(row, col, 1, -1, color)   // Diagonal /
        );
    }

    #checkDirection(row, col, rowDir, colDir, color) {
        let count = 0;

        for (let i = -3; i <= 3; i++) {
            const newRow = row + i * rowDir;
            const newCol = col + i * colDir;

            if (
                newRow >= 0 &&
                newRow < this.#rows &&
                newCol >= 0 &&
                newCol < this.#cols &&
                this.#board[newRow][newCol] === color
            ) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }

        return false;
    }

    #reset() {
        this.#turn = 0;

        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                this.#board[i][j] = null;
            }
        }

        this.#createBoard();
    }

    #print() {
        console.log("Estado del tablero:");
        console.log("   " + Array.from({ length: this.#cols }, (_, i) => ` C${i} `).join("")); // Encabezado de columnas
        for (let i = 0; i < this.#rows; i++) {
            const row = this.#board[i]
                .map(cell => {
                    if (!cell) return " . "; // Celda vacía
                    if (cell === "circle_playerOne") return " R "; // Ficha del jugador 1 (rojo)
                    if (cell === "circle_playerTwo") return " Y "; // Ficha del jugador 2 (amarillo)
                })
                .join("");
            console.log(`F${i} ${row}`); // Imprime la fila con su índice
        }
    }

    start() {
        this.#reset();
        if (this.#sound) {
            this.#sound.play();
        }
    }

    stop() {
        if (this.#sound) {
            this.#sound.pause();
        }
    }

    restart() {
        this.#reset();
    }
}