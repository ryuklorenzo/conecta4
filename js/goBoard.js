class GoBoard extends Scene {
    #board = null;
    _options = null;
    #rows = 6;
    #cols = 7;
    #turn = 0;

    constructor(container, next) {
        super(container, next);

        this._options = {
            player1: { name: "Player 1" },
            player2: { name: "Player 2" },
        };

        this.#board = Array.from({ length: this.#rows }, () => Array(this.#cols).fill(null));

        // Configurar botón Reset
        this._container.querySelector("#resetBoard").addEventListener("click", () => {
            this.#reset();
        });

        // Configurar botón Siguiente
        const nextButton = document.getElementById("nextButton");
        nextButton.addEventListener("click", () => {
            this.#goToNextScreen();
        });

        // Crear el tablero al iniciar
        this.#createBoard();
    }

    start() {
        console.log("Método start ejecutado en GoBoard.");
        this.#reset(); // Reinicia el tablero al iniciar
    }

    stop() {
        console.log("Método stop ejecutado en GoBoard.");
        // Aquí puedes agregar lógica adicional si es necesario
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
                boardElement.appendChild(cell); // Agregar la celda al tablero
            }
        }
    }

    #handleCellClick(row, col) {
        for (let i = this.#rows - 1; i >= 0; i--) {
            if (!this.#board[i][col]) {
                this.#board[i][col] = this.#turn === 0 ? "circle_playerOne" : "circle_playerTwo";
                this.#updateBoard();

                if (this.#checkWinner(i, col)) {
                    const winner = this.#turn === 0 ? this._options.player1.name : this._options.player2.name;
                    alert(`${winner} gana!`);

                    // Mostrar el botón "Siguiente"
                    const nextButton = document.getElementById("nextButton");
                    nextButton.style.display = "block";
                    return;
                }

                this.#turn = 1 - this.#turn;
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
                cell.classList.add(this.#board[row][col]); // Agregar clase para el jugador
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

        // Ocultar el botón "Siguiente" al reiniciar
        const nextButton = document.getElementById("nextButton");
        nextButton.style.display = "none";
    }

    #goToNextScreen() {
        // Ocultar el tablero
        const boardContainer = document.getElementById("boardContainer");
        boardContainer.style.display = "none";
    
        // Mostrar la pantalla final
        const endScreen = document.getElementById("end");
        endScreen.style.display = "flex"; // Cambiar a "flex" para que sea visible
    
        // Actualizar el mensaje de la pantalla final
        const endMessage = document.getElementById("endMessage");
        if (endMessage) {
            endMessage.textContent = "¡Gracias por jugar! Presiona Reset para volver a empezar.";
        }
    }
}