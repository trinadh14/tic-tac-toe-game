const board = document.querySelector('#board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('#reset');
let currentPlayer = 'X';
let gameActive = true;
let boardState = Array(9).fill(null);

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (!gameActive || boardState[clickedIndex]) return;

    boardState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    if (checkWin()) {
        alert(`${currentPlayer} wins!`);
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell)) {
        alert('It\'s a draw!');
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (currentPlayer === 'O') {
        setTimeout(computerMove, 500);
    }
};

const computerMove = () => {
    const bestMove = minimax(boardState, 'O').index;
    boardState[bestMove] = 'O';
    cells[bestMove].textContent = 'O';

    if (checkWin()) {
        alert('Computer wins!');
        gameActive = false;
        return;
    }

    if (boardState.every(cell => cell)) {
        alert('It\'s a draw!');
        gameActive = false;
    }

    currentPlayer = 'X';
};

const minimax = (newBoard, player) => {
    const availSpots = newBoard.map((cell, index) => cell === null ? index : null).filter(val => val !== null);

    if (checkWinner(newBoard, 'X')) {
        return { score: -10 };
    } else if (checkWinner(newBoard, 'O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newBoard[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newBoard, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newBoard, 'O');
            move.score = result.score;
        }

        newBoard[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
};

const checkWinner = (board, player) => {
    return winningCombinations.some(combination => {
        const [a, b, c] = combination;
        return board[a] === player && board[b] === player && board[c] === player;
    });
};

const checkWin = () => {
    return checkWinner(boardState, currentPlayer);
};

const resetGame = () => {
    boardState = Array(9).fill(null);
    cells.forEach(cell => cell.textContent = '');
    currentPlayer = 'X';
    gameActive = true;
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
