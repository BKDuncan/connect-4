import React from 'react';
import './Loader.css';

const Loader = (props) => (
    <div className='loader-modal'>
        <div className={'loader-content ' + props.theme + '-ui2'}>
            <h2 className={props.theme}>Matchmaking</h2>
            <h3 className={props.theme + '-tertiary'}>{props.text}</h3>
            <div className={'spinner ' + props.theme} />
            <button className={'btn ' + props.theme}
                onClick={() => {props.cancel()}}>Cancel</button>
        </div>
    </div>
);

export default Loader;