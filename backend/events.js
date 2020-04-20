const EVENT = {
    // User to Server
    JOIN: 'connection',
    CLIENT_CONNECT: 'connect',
    LEAVE: 'disconnect',

    CHANGE_NAME: 'change_name',
    JOIN_GAME: 'join_game',
    RANDOM_GAME: 'random_game',
    LEAVE_GAME: 'leave_game',
    STOP_MATCHMAKING: 'end_matchmaking',
    
    // Server to Individual User
    INITIALIZE: 'initialize',
    GAME_JOINED: 'game_joined',
    INVALID_GAME_CODE: 'invalid_game_code',
    GAME_FULL: 'game_full',

    TAKE_TURN: 'turn',
    LOSE: 'lose',
    WIN: 'win',
    TIE: 'tie'
};

export default EVENT;