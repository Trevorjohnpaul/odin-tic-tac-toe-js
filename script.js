
// This is the immediately invoked function expression (IIFE)
// that creates a Gameboard module.
// It initializes a board array with nine empty strings,
// representing the cells of a tic-tac-toe game.
// The module exposes a method getBoard that returns the current state of the board.
const Gameboard = (function() {
    let board = ["", "", "", "", "", "", "", "", ""];

    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""];
    }

    return {
        getBoard: function() {
            return board;
        },
        resetBoard
    };
})();

// This is the player factory function that creates player objects with a name and a marker (X or O).
function Player(name, marker) {
    return {
        name,
        marker
    };
}

let playerOne = Player("Player 1", "X");
let playerTwo = Player("Player 2", "O");

const GameController = (function() {
    let activePlayer = playerOne;

    function restartGame() {
        Gameboard.resetBoard();
        activePlayer = playerOne;
    }

    function getActivePlayer() {
        return activePlayer;
    }

    function switchPlayerTurn() {
        activePlayer = activePlayer === playerOne ? playerTwo : playerOne;
    }

    function setPlayerNames(nameOne, nameTwo) {
        playerOne = Player(nameOne || "Player 1", "X");
        playerTwo = Player(nameTwo || "Player 2", "O");
        restartGame();
    }

    function getStatusMessage() {
        const winner = checkWinner();

        if (winner) {
            return `${activePlayer.name} wins!`;
        }

        if (checkTie()) {
            return "It's a tie!";
        }

        return `${activePlayer.name}'s turn (${activePlayer.marker})`;
    }

    function checkWinner(board = Gameboard.getBoard()) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const [a, b, c] of winningCombinations) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }

        return null;
    }

    function checkTie(board = Gameboard.getBoard()) {
        return !board.includes("") && checkWinner(board) === null;
    }

    function playRound(index) {
        const board = Gameboard.getBoard();

        if (index < 0 || index >= board.length || board[index] !== "") {
            console.log("That position is already taken or invalid!");
            return;
        }

        board[index] = activePlayer.marker;
        console.log(`${activePlayer.name} placed ${activePlayer.marker}`);

        const winner = checkWinner(board);
        if (winner) {
            console.log(`${winner} wins!`);
            return;
        }

        if (checkTie(board)) {
            console.log("It's a tie!");
            return;
        }

        switchPlayerTurn();
    }

    // PUBLIC METHODS
   return {
    getActivePlayer,
    switchPlayerTurn,
    checkWinner,
    checkTie,
    playRound,
    restartGame,
    setPlayerNames,
    getStatusMessage
};
})();

const DisplayController = (function() {
    const gameboardElement = document.querySelector("#gameboard");
    const statusElement = document.querySelector("#game-status");
    const startButton = document.querySelector("#start-button");

    if (!gameboardElement || !statusElement || !startButton) {
        return {
            renderBoard: function() {}
        };
    }

    function renderBoard() {
        const board = Gameboard.getBoard();
        gameboardElement.innerHTML = "";

        board.forEach((cell, index) => {
            const cellElement = document.createElement("button");
            cellElement.type = "button";
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            gameboardElement.appendChild(cellElement);
        });

        statusElement.textContent = GameController.getStatusMessage();
    }

    gameboardElement.addEventListener("click", (event) => {
        const clickedCell = event.target.closest(".cell");

        if (!clickedCell) return;

        const index = Number(clickedCell.dataset.index);
        GameController.playRound(index);
        renderBoard();
    });

    startButton.addEventListener("click", () => {
        const nameOne = document.querySelector("#player-one").value.trim();
        const nameTwo = document.querySelector("#player-two").value.trim();

        GameController.setPlayerNames(nameOne, nameTwo);
        renderBoard();
    });

    return {
        renderBoard
    };
})();

DisplayController.renderBoard();