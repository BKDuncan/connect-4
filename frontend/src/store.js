import EVENT from './events';
import THEME from './theme';
import { observable, action } from 'mobx';
import Cookies from 'universal-cookie';
import socketIOClient from 'socket.io-client';

const endpoint = '127.0.0.1:8000';
const cookies = new Cookies();

const store = observable({
    id: '',
    username: '',
    theme: THEME.DEFAULT,
    connect: 'not connected',
    socket: null,

    matchmaking: false,
    matchmakingStatus: '',

    // GAME
    gameID: null,
    player: null,
    opponentName: null,
    gameState: [],
    turn: false,
    gameStatus: null,
    mayExit: false,

    initialize() {
        // Connect to Server
        const savedInfo = cookies.get('user');
        if (savedInfo && savedInfo.theme && THEME[savedInfo.theme.toUpperCase()]) {
            this.theme = THEME[savedInfo.theme.toUpperCase()] || THEME.DEFAULT;
        }
        else {
            this.theme = THEME.DEFAULT;
        }
        this.socket = socketIOClient.connect(endpoint, { query: { ...savedInfo }, transports: ['websocket'] });
    },

    cleanup() {
        // Cleanup so we don't listen twice for the same event
        if (this.socket) {
            this.socket.removeAllListeners();
        }
    },

    setupEvents() {
        if (this.socket) {
            // Subscribe to server sent events
            this.socket.on(EVENT.CLIENT_CONNECT, () => {
                this.connect = 'connected';
            });

            this.socket.on('disconnect', () => {
                this.connect = 'disconnected';
                this.socket.removeAllListeners();
            });

            this.socket.on(EVENT.INITIALIZE, state => {
                this.username = state.username;
                this.id = state.id;
            });

            this.socket.on(EVENT.GAME_JOINED, state => {
                if (this.gameID !== null) {
                    // If we are challenged while on the end/disconnect screen
                    this.leaveGame();
                }

                // Alert the other player that they are being challenged
                this.matchmakingStatus = this.matchmaking ? 'Joined ' + state.opponentName + "'s game!" : state.opponentName + ' has challenged you to Connect 4!';
                this.matchmaking = true;
                setTimeout(() => {
                    this.matchmaking = false;
                    this.gameID = state.gameID;
                    this.player = this.gameID === this.id ? 0 : 1;
                    this.opponentName = state.opponentName;
                    this.gameState = state.game;
                    this.turn = state.turn;
                }, 2000)
            });

            this.socket.on(EVENT.TAKE_TURN, state => {
                this.gameState = state.game;
                this.turn = state.turn;
            });

            this.socket.on(EVENT.INVALID_GAME_CODE, state => {
                // Alert the other player that they are being challenged
                this.matchmakingStatus = 'Game code invalid! Please enter a valid code.';
                setTimeout(() => {
                    this.matchmaking = false;
                    this.matchmakingStatus = '';
                }, 2000)
            });

            this.socket.on(EVENT.GAME_FULL, state => {
                // Alert the other player that they are being challenged
                this.matchmakingStatus = 'Game Full! The player is already in another match.';
                setTimeout(() => {
                    this.matchmaking = false;
                    this.matchmakingStatus = '';
                }, 2000)
            });

            this.socket.on(EVENT.LEAVE_GAME, state => {
                this.gameStatus = this.opponentName + ' has left the game!';
                this.mayExit = true;
            });

            this.socket.on(EVENT.WIN, state => {
                this.gameStatus = 'You won the game!';
                this.mayExit = true;
            });

            this.socket.on(EVENT.LOSE, state => {
                this.gameStatus = this.opponentName + ' has won the game!';
                this.mayExit = true;
            });

            this.socket.on(EVENT.TIE, state => {
                this.gameStatus = 'Tie Game!';
                this.mayExit = true;
            });
        }
    },

    saveCookie() {
        if (this.username.length > 0 && this.theme.length > 0) {
            console.log('Save Cookie');
            const cookie = {
                username: this.username,
                theme: this.theme
            }
            cookies.set('user', cookie, { path: '/', maxAge: 31536000 });
        }
    },

    announceName() {
        if (this.socket) {
            this.socket.emit(EVENT.CHANGE_NAME, this.username);
        }
    },

    joinGame(gameCode) {
        console.log('Join game ' + gameCode)
        if (this.socket) {
            this.matchmaking = true;
            this.matchmakingStatus = 'Joining game...'
            this.socket.emit(EVENT.JOIN_GAME, gameCode);
        }
    },

    joinRandomGame() {
        if (this.socket) {
            this.matchmaking = true;
            this.matchmakingStatus = 'Looking for an opponent...'
            this.socket.emit(EVENT.RANDOM_GAME, null);
        }
    },

    leaveGame() {
        const resetStatus = {
            ...this,
            matchmaking: false,
            matchmakingStatus: '',
            gameID: null,
            opponentName: null,
            gameState: [],
            turn: null,
            gameStatus: null,
            mayExit: false
        };
        Object.assign(this, resetStatus);
    },

    cancelMatchmaking() {
        if (this.socket) {
            this.socket.emit(EVENT.STOP_MATCHMAKING, null);
        }
        this.matchmaking = false;
        this.matchmakingStatus = '';
    },

    takeTurn(row, col) {
        this.gameState[row][col] = 'p' + this.player;
        this.turn = (this.turn + 1) % 2;
        if (this.socket) {
            this.socket.emit(EVENT.TAKE_TURN, {
                gameID: this.gameID,
                game: this.gameState,
                turn: this.turn
            });
        }
    },

},
    {
        initialize: action,
        cleanup: action,
        setupEvents: action,
        saveCookie: action,
        announceName: action,
        joinGame: action,
        joinRandomGame: action,
        cancelMatchmaking: action,
    }
);

export default store;