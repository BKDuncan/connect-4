import React from 'react';

const BoardCell = (props) => {

    const createClass = () => {
        if(props.value) {
            return props.value +  '-' + props.theme;
        }
        else {
            return props.disabled ? props.theme : 'valid-' + props.player + '-' + props.theme;
        }
    }

    return (
    <div key={props.key} className={'board-cell ' + props.theme}>
        <button
            className={'cell ' + createClass()}
            disabled={props.disabled}
            onClick={() => {props.onClick();}} 
        />
    </div>
    );
};

export default BoardCell;