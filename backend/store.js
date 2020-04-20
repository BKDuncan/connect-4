import EVENT from './events.js';
import { generateName } from './util/nameGenerator.js';
import * as connect4 from './game.js';

let users = {};
let randomUser;
let games = {};
let allSockets;

const store = {
    setSocket: (newSocket) => { allSockets = newSocket },

    addUser: (socket) => {
        // check for cookies
        let { username } = socket.handshake.query;
        if (!username || username.length < 1) {
            username = generateName();
        }
        const user = {
            id: socket.id,
            username,
            game: null
        };
        users[socket.id] = user;
        socket.emit(EVENT.INITIALIZE, user);
        console.log(EVENT.ADD_USER + ': ' + user.username + ' ID=' + socket.id + '\n');
    },

    removeUser: (socket) => {
        console.log(EVENT.REMOVE_USER + ':' + ' ID=' + socket.id + '\n');
        let opponent = null;
        if (users[socket.id].game) {
            const gameID = users[socket.id].game;
            if(games[gameID]) {
                opponent = (socket.id === games[gameID].playerOne.id)
                    ? games[gameID].playerTwo.id
                    : games[gameID].playerOne.id;
                delete games[gameID];

                users[opponent].game = null;
            }

        }
        delete users[socket.id];
        return opponent;
    },

    changeName: (socket, name) => {
        users[socket.id].username = name;
    },

    joinGame: (socket, gameCode) => {
        if (users[gameCode] && !users[gameCode].game && gameCode !== socket.id) {
            const gameBoard = connect4.BOARD;
            users[gameCode].game = gameCode;
            users[socket.id].game = gameCode;

            // Randomly pick who goes first
            const turn = Math.random() < 0.5 ? 0 : 1;

            games[gameCode] = {
                gameID: gameCode,
                turn,
                playerOne: users[gameCode],
                playerTwo: users[socket.id],
                game: gameBoard,
            }

            return games[gameCode];

        }
        else if (!users[gameCode] || gameCode === socket.id) {
            socket.emit(EVENT.INVALID_GAME_CODE);
            console.log('INVALID GAME CODE');
        }
        else {
            socket.emit(EVENT.GAME_FULL);
            console.log('GAME ALREADY FULL');
        }
        return null;
    },

    randomMatch: (socket) => {
        if(randomUser) {
            let randomID = randomUser;
            randomUser = null;
            return store.joinGame(socket, randomID);
        }
        else {
            randomUser = socket.id;
        }
    },

    endMatchmaking: (socket) => {
        if(randomUser === socket.id) {
            randomUser = null;
        }
    },

    takeTurn: (move) => {
        games[move.gameID].game = move.game;
        games[move.gameID].turn = move.turn;

        let winner = connect4.checkBoard(move.game);

        if(winner) {
            let game = games[move.gameID];
            delete games[move.gameID];
            users[game.playerOne.id].game = null;
            users[game.playerTwo.id].game = null;
            return {
                ...game,
                gameover: true,
                event: winner,
            };
        }
        else {
            return games[move.gameID];
        }
    }

};

export default store;