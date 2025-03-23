const CellColor = {
    BLACK: 'back',
    WHITE: 'white',
}

class GoBoard extends Scene {
    constructor() {
        this.rows = 6;
        this.cols = 7;
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(null));
        this.currentPlayer = 'red';
        this.gameOver = false;
        this.boardDiv = document.getElementById("board");
        this.createBoard();
    }

    createBoard() {
        this.boardDiv.innerHTML = '';
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.addEventListener("click", () => this.dropDisc(c));
                this.boardDiv.appendChild(cell);
            }
        }
    }

    dropDisc(col) {
        if (this.gameOver) return;

        for (let r = this.rows - 1; r >= 0; r--) {
            if (!this.board[r][col]) {
                this.board[r][col] = this.currentPlayer;
                this.updateBoard();
                if (this.checkWinner(r, col)) {
                    document.getElementById("message").textContent = `${this.currentPlayer.toUpperCase()} gana!`;
                    this.gameOver = true;
                    return;
                }
                this.currentPlayer = this.currentPlayer === 'red' ? 'yellow' : 'red';
                return;
            }
        }
    }

    updateBoard() {
        const cells = document.querySelectorAll(".cell");
        cells.forEach(cell => {
            const r = Number(cell.dataset.row);
            const c = Number(cell.dataset.col);
            cell.className = "cell";
            if (this.board[r][c]) cell.classList.add(this.board[r][c]);
        });
    }

    checkWinner(r, c) {
        return this.checkDirection(r, c, 1, 0) ||
               this.checkDirection(r, c, 0, 1) ||
               this.checkDirection(r, c, 1, 1) ||
               this.checkDirection(r, c, 1, -1);
    }

    checkDirection(r, c, dr, dc) {
        let count = 0;
        for (let i = -3; i <= 3; i++) {
            let nr = r + i * dr;
            let nc = c + i * dc;
            if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols && this.board[nr][nc] === this.currentPlayer) {
                count++;
                if (count === 4) return true;
            } else {
                count = 0;
            }
        }
        return false;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new Game();
});