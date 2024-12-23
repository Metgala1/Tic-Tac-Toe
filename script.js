// Gameboard Module (IIFE)
const Gameboard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const setCell = (index, value) => {
        if (board[index] === "") {
            board[index] = value;
            return true;
        }
        return false;
    };

    const resetBoard = () => board.fill("");

    return { getBoard, setCell, resetBoard };
})();


const Player = (name, symbol) => {
    return { name, symbol };
};


const Game = (() => {
    let currentPlayer;
    let players;
    let gameOver;

    const startNewGame = (player1Name, player2Name) => {
        Gameboard.resetBoard();
        players = [Player(player1Name, "X"), Player(player2Name, "O")];
        currentPlayer = players[0];
        gameOver = false;
        DisplayController.renderBoard();
    };

    const getCurrentPlayer = () => currentPlayer;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        for (const condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameOver = true;
                return board[a];
            }
        }

        if (!board.includes("")) {
            gameOver = true;
            return "tie";
        }

        return null;
    };

    const getGameOver = () => gameOver;

    return { startNewGame, getCurrentPlayer, switchPlayer, checkWin, getGameOver };
})();


const DisplayController = (() => {
    const boardElement = document.getElementById("board");
    const messageElement = document.getElementById("message");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        boardElement.innerHTML = "";

        board.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.textContent = cell;
            cellElement.dataset.index = index;
            cellElement.addEventListener("click", handleCellClick);
            boardElement.appendChild(cellElement);
        });
    };

    const setMessage = (message) => {
        messageElement.textContent = message;
    };

    const handleCellClick = (event) => {
        if (Game.getGameOver()) return;

        const index = event.target.dataset.index;
        if (Gameboard.setCell(index, Game.getCurrentPlayer().symbol)) {
            renderBoard();
            const winner = Game.checkWin();
            if (winner) {
                if (winner === "tie") {
                    setMessage("It's a tie!");
                } else {
                    setMessage(`${Game.getCurrentPlayer().name} Wins!`);
                }
            } else {
                Game.switchPlayer();
                setMessage(`${Game.getCurrentPlayer().name}'s turn`);
            }
        } else {
            setMessage("This spot is taken.");
        }
    };

    return { renderBoard, setMessage }; 
})();

const startBtn = document.getElementById("start-btn");
startBtn.addEventListener("click", () => {
    const player1Name = document.getElementById("player1").value;
    const player2Name = document.getElementById("player2").value;
    Game.startNewGame(player1Name, player2Name);
    DisplayController.setMessage(`${Game.getCurrentPlayer().name}'s turn`);
});




