import React from 'react';
import { Card } from 'react-bootstrap';

const Slider = (props) => {
    const changeFunction = (event) => {
        const newValue = parseInt(event.target.value, 10);
        const newState = {
            ...props.state,
        };
        newState[props.toChange] = newValue;
        props.setState(newState);
        if (props.onChange) {
            props.onChange(newValue);
        }
    };

    return (
        <Card style={{ width: '100%', textAlign: 'left', fontSize: 18, padding: '0' }}>
            <Card.Body style={{ padding: '10px' }}>
                <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    value={props.state[props.toChange] === null ? '' : props.state[props.toChange]} // Show no value if null
                    onChange={changeFunction} 
                    className="slider" 
                    style={{ width: '100%' }}
                    id={props.toChange} 
                />
                <label htmlFor={props.toChange}>
                    {props.state[props.toChange] === null ? 'Select a value' : props.state[props.toChange]}
                </label>
            </Card.Body>
        </Card>
    );
};

export default Slider;
