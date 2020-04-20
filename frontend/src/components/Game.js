import React, { useCallback } from 'react';
import './Game.css';
import { useHistory } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import THEME from '../theme';
import BoardCell from './BoardCell';

const Game = props => {
    const history = useHistory();

    if (props.store.opponentName === null) {
        props.store.leaveGame();
        history.push('/');
    }

    const getMessage = useCallback(() => {
        if (props.store.gameStatus) {
            return props.store.gameStatus;
        }
        const myTurn = props.store.turn === props.store.player;
        return myTurn
            ? "It's your turn " + props.store.username + '.'
            : 'Please wait for ' + props.store.opponentName + ' to make their move.';
    }, [props.store.gameStatus, props.store.turn, props.store.player]);

    const checkValidMove = useCallback((row, col) => {
        if (props.store.turn !== props.store.player) {
            return true; // Make all moves invalid if its not my turn
        }

        const board = props.store.gameState;
        // Check if occupied
        if (board[row][col]) {
            return true; // Invalid move
        }
        // Check if its the first row, or the cell below it is occupied
        if (row === 5 || board[row + 1][col]) {
            return false; // valid move
        }
        return true;
    }, [props.store.turn, props.store.gameState]);

    return (
        <div className={'app ' + props.store.theme + '-background'}>
            <h1 className={props.store.theme}>{props.store.username + ' vs. ' + props.store.opponentName}</h1>
            <div className='msg-container'>
                <h3 className={props.store.theme + '-secondary'}>{getMessage()}</h3>
                <div className='theme-div'>
                    THEME
                    <select
                        className={props.store.theme + '-ui2 btn ' + props.store.theme}
                        value={props.store.theme}
                        onChange={(evt) => { props.store.theme = evt.target.value }}>
                        <option value={THEME.DEFAULT}>Default</option>
                        <option value={THEME.DARK}>Dark Mode</option>
                        <option value={THEME.LIGHT}>Light Mode</option>
                    </select>
                </div>
            </div>
            {props.store.mayExit && <button className={'btn ' + props.store.theme} onClick={() => {
                props.store.leaveGame();
                history.push('/');
            }}>Return to Lobby</button>}
            <div className='board'>
                {props.store.gameState.map((row, rowIndex) => {
                    return (
                        <div className={'board-row ' + props.store.theme + '-ui2'} key={'row-' + rowIndex}>
                            {row.map((cell, index) => {
                                return (
                                    <BoardCell
                                        key={'row-' + rowIndex + '-cell-' + index}
                                        disabled={checkValidMove(rowIndex, index)}
                                        theme={props.store.theme}
                                        player={'p' + props.store.player}
                                        value={cell}
                                        onClick={() => { props.store.takeTurn(rowIndex, index) }}
                                    />
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default inject('store')(observer(Game));