import React, { useEffect, useState } from 'react';
import './Lobby.css';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import THEME from '../theme';
import Loader from './Loader';

const Lobby = props => {
    const history = useHistory();
    const [gameCode, setGameCode] = useState('');

    useEffect(() => {
        props.store.saveCookie();
        props.store.announceName();
    }, [props.store.username, props.store.theme]
    )

    useEffect(() => {
        if (props.store.gameID) {
            history.push('/game/' + props.store.gameID);
        }
    }, [props.store.gameID]
    )

    // Copy text to clipboard
    const copy = (text) => {
        var input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        var result = document.execCommand('copy');
        document.body.removeChild(input);
        return result;
    }

    return (
        <div className={'app ' + props.store.theme + '-background'}>
            <h1 className={props.store.theme}>Lobby</h1>
            <div className={'user-container ' + props.store.theme + '-ui'}>
                <h3 className={props.store.theme + '-secondary'}>User Settings</h3>
                <div className='input-row'>
                    <div>
                        NAME
                    <input
                            className={props.store.theme}
                            type='text'
                            value={props.store.username}
                            onChange={(evt) => { props.store.username = evt.target.value }}
                        />
                    </div>
                    <div>
                        THEME
                    <select
                            className={props.store.theme + ' btn'}
                            value={props.store.theme}
                            onChange={(evt) => { props.store.theme = evt.target.value }}>
                            <option value={THEME.DEFAULT}>Default</option>
                            <option value={THEME.DARK}>Dark Mode</option>
                            <option value={THEME.LIGHT}>Light Mode</option>
                        </select>
                    </div>
                </div>
                <h4 className={props.store.theme + '-secondary'}>You can edit your name.</h4>
            </div>

            <div className='row'>
                <div className={'code-container ' + props.store.theme + '-ui2'}>
                    <h3 className={props.store.theme}>Game Code</h3>
                    <div className={props.store.theme + '-tertiary'}>
                        Welcome to the Connect 4 lobby. <br /><br /> Your game code is
                            <div className='code-btn-container'>
                            <button
                                className={'btn ' + props.store.theme}
                                onClick={() => copy(props.store.id)}
                            >{props.store.id}
                            </button>
                        </div>
                        Share it with a friend to start a game of connect-4.
                        <br /><br />
                        Click the code to copy it.
                </div>
                </div>

                <div className={'matchmaking-container ' + props.store.theme + '-ui2'}>
                    <h3 className={props.store.theme}>Matchmaking</h3>
                    <div className={props.store.theme + '-tertiary'}>
                        Join a custom game by entering a players game code
                    <div>
                            <div className='code-btn-container'>
                                <input
                                    className={'code-input ' + props.store.theme}
                                    type='text'
                                    value={gameCode}
                                    placeholder='Enter a game code...'
                                    onChange={(evt) => { setGameCode(evt.target.value) }}
                                />
                                <button
                                    className={'btn ' + props.store.theme}
                                    onClick={() => {
                                        props.store.joinGame(gameCode);
                                    }}>
                                    JOIN GAME
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={props.store.theme + '-tertiary'}>
                        Join a random players game
                        <div className='code-btn-container'>
                            <button
                                className={'btn ' + props.store.theme}
                                onClick={() => {
                                    props.store.joinRandomGame();
                                }}>
                                FIND RANDOM OPPONENT
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {props.store.matchmaking && <Loader
                text={props.store.matchmakingStatus}
                theme={props.store.theme}
                cancel={() => {props.store.cancelMatchmaking()}}
            />}
        </div>
    );
};

export default inject('store')(observer(Lobby));