import EVENT from './events.js';

export const BOARD =
    [[null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null]];

export const checkBoard = (board) => {
    return checkVerticals(board)
        || checkHorizontals(board)
        || checkDiagonals(board)
        || checkTie(board);
};

const checkVerticals = (board) => {
    let count;
    let last;

    for (let i = 0; i < board.length; i++) {
        last = board[i][0];
        count = 0;
        for (let j = 0; j < board[i].length; j++) {
            if (last === board[i][j] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[i][j]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }
    return null;
}

const checkHorizontals = (board) => {
    let count;
    let last;

    for (let i = 0; i < board[0].length; i++) {
        last = board[0][i];
        count = 0;
        for (let j = 0; j < board.length; j++) {
            if (last === board[j][i] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[j][i]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }
    return null;
}

const checkDiagonals = (board) => {
    // check col 0 - main diagonal
    for (let row = 0; row < board.length; row++) {
        let last = board[row][0];
        let count = 0;
        for (let i = row, j = 0; i < board.length && j < board[0].length; i++, j++) {
            if (last === board[i][j] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[i][j]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }

    // check row 0 - main diagonal
    for (let col = 0; col < board.length; col++) {
        let last = board[0][col];
        let count = 0;
        for (let i = 0, j = col; i < board.length && j < board[0].length; i++, j++) {
            if (last === board[i][j] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[i][j]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }

    // check check row 0 - reverse diagonal
    for (let row = 0; row < board.length; row++) {
        let last = board[row][0];
        let count = 0;
        for (let i = row, j = 0; i > -1 && j < board[0].length; i--, j++) {
            if (last === board[i][j] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[i][j]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }

    // check col N - reverse diagonal
    for (let col = 0; col < board.length; col++) {
        let last = board[board.length - 1][col];
        let count = 0;
        for (let i = board.length - 1, j = col; i > -1 && j < board[0].length; i--, j++) {
            if (last === board[i][j] && last !== null) {
                count++;
            }
            else {
                count = 1;
                last = board[i][j]
            }
            if (count > 3) {
                return EVENT.WIN;
            }
        }
    }

    return null;
}

const checkTie = (board) => {
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === null) {
                return null;
            }
        }
    }
    return EVENT.TIE;
}