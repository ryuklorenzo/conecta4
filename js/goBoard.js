class GoBoard extends Scene {
    #board = null;
    _options = null;
    #rows = 6; // Filas
    #cols = 7; // Columnas
    #turn = 0;

    constructor(container, next) {
        super(container, next);
        // Configuración de opciones
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
    // Crear celda
    #createNode(row, col) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.row = row;
        cell.dataset.col = col;
        // Agregar evento click a la celda
        cell.addEventListener("click", () => {
            this.#handleCellClick(row, col);
        });

        return cell;
    }
    // Crear tablero
    #createBoard() {
        const boardElement = document.getElementById("board");
        boardElement.innerHTML = ""; // Limpiar el tablero
        // Crear celdas
        for (let i = 0; i < this.#rows; i++) {
            for (let j = 0; j < this.#cols; j++) {
                const cell = this.#createNode(i, j);
                this.#board[i][j] = null; // Inicializar la celda como vacía
                boardElement.appendChild(cell); // Agregar la celda al tablero
            }
        }
    }
    // Clics en las celdas
    #handleCellClick(row, col) {
        for (let i = this.#rows - 1; i >= 0; i--) {
            if (!this.#board[i][col]) {
                // Asignar celdas
                this.#board[i][col] = this.#turn === 0 ? "circle_playerOne" : "circle_playerTwo";
                this.#updateBoard();
                // Verificar si hay un ganador
                if (this.#checkWinner(i, col)) {
                    const winner = this.#turn === 0 ? this._options.player1.name : this._options.player2.name;
                    alert(`${winner} oleeee has ganado!`);
                    const nextButton = document.getElementById("nextButton");
                    nextButton.style.display = "block";
                    return;
                }
                // Cambiar de turno
                this.#turn = 1 - this.#turn;
                return;
            }
        }

        alert("¡La columna esta llena bestia ponlo en otro sitio!");
    }
    // Actualizar tablero visualmente
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
    //Verificar ganador
    #checkWinner(row, col) {
        const color = this.#turn === 0 ? "circle_playerOne" : "circle_playerTwo";

        return (
            this.#checkDirection(row, col, 1, 0, color) || // Vertical
            this.#checkDirection(row, col, 0, 1, color) || // Horizontal
            this.#checkDirection(row, col, 1, 1, color) || // Diagonal \
            this.#checkDirection(row, col, 1, -1, color)   // Diagonal /
        );
    }
    // Verificar direccion específica
    #checkDirection(row, col, rowDir, colDir, color) {
        let count = 0;
        // Verificar en ambas direcciones
        for (let i = -3; i <= 3; i++) {
            const newRow = row + i * rowDir;
            const newCol = col + i * colDir;
            // Verificar si la celda está dentro del tablero y tiene el color correcto
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
    // Reiniciar tablero
    #reset() {
        this.#turn = 0;
        // Limpiar el tablero
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
    // Ir a la siguiente pantalla
    #goToNextScreen() {
        // Ocultar el tablero
        const boardContainer = document.getElementById("boardContainer");
        boardContainer.style.display = "none";
    
        // Mostrar la pantalla final
        const endScreen = document.getElementById("end");
        endScreen.style.display = "flex"; 
    
        // Actualizar el mensaje de la pantalla final
        const endMessage = document.getElementById("endMessage");
        if (endMessage) {
            endMessage.textContent = "¡Gracias por jugar! Presiona Reset para volver a empezar.";
        }
    }
}