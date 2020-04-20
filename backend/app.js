import express from 'express';
import http from 'http';
import cors from 'cors';
import httpRouter from './routes/httpRouter.js';
import socketIo from 'socket.io';
import store from './store.js';
import EVENT from './events.js';

// creating an express server instance
const app = express();
const server = http.createServer(app);

// getting the port from environment variable
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: '2MB' }));
app.use('/', httpRouter);

const io = socketIo(server);
store.setSocket(io);

io.on(EVENT.JOIN, socket => {
    store.addUser(socket);

    socket.on(EVENT.LEAVE, () => {
        const opponent = store.removeUser(socket);
        io.to(opponent).emit(EVENT.LEAVE_GAME);
    });

    socket.on(EVENT.CHANGE_NAME, name => {
        store.changeName(socket, name);
    });

    socket.on(EVENT.JOIN_GAME, gameCode => {
        console.log('Joining game ' + gameCode)
        let newGame = store.joinGame(socket, gameCode);
        if (newGame) {
            io.to(newGame.playerOne.id).emit(EVENT.GAME_JOINED, {
                ...newGame,
                opponentName: newGame.playerTwo.username
            });
            io.to(newGame.playerTwo.id).emit(EVENT.GAME_JOINED, {
                ...newGame,
                opponentName: newGame.playerOne.username
            });
        }
    });

    socket.on(EVENT.RANDOM_GAME, () => {
        console.log('Random game ' + socket.id);
        let newGame = store.randomMatch(socket);
        if (newGame) {
            io.to(newGame.playerOne.id).emit(EVENT.GAME_JOINED, {
                ...newGame,
                opponentName: newGame.playerTwo.username
            });
            io.to(newGame.playerTwo.id).emit(EVENT.GAME_JOINED, {
                ...newGame,
                opponentName: newGame.playerOne.username
            });
        }
    });

    socket.on(EVENT.STOP_MATCHMAKING, () => {
        console.log('Cancel matchmaking ' + socket.id);
        store.endMatchmaking(socket);
    });

    socket.on(EVENT.TAKE_TURN, move => {
        console.log('Took turn ' + socket.id);
        let newState = store.takeTurn(move);
        if (newState.gameover) {
            if(newState.event === EVENT.TIE){
                io.to(newState.playerOne.id).emit(EVENT.TIE, {});
                io.to(newState.playerTwo.id).emit(EVENT.TIE, {});
            }
            else {
                let loser = newState.playerOne.id === socket.id
                ? newState.playerTwo.id
                : newState.playerOne.id;

                io.to(socket.id).emit(EVENT.WIN, {});
                io.to(loser).emit(EVENT.LOSE, {});
            }
        }
        else {
            let opponent = newState.playerOne.id === socket.id
                ? newState.playerTwo.id
                : newState.playerOne.id;
            io.to(opponent).emit(EVENT.TAKE_TURN, newState);
        }
    });
});

server.listen(port, () => {
    console.log('Server is running on port:', port);
});