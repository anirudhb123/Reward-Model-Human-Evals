import React from 'react';
import { Card } from 'react-bootstrap';

const Likert = (props) => {
    const options = []
    
    const changeFunction = (event) => {
        const newState = {
            ...props.state,
        }
        console.log(props)
        newState[props.toChange] = event.target.value
        props.setState(newState)
    }

    props.options?.map(option => {
        const parts = option.split(':'); // Split the option into parts at the colon
        const labelContent = parts.length > 1 
            ? <><strong>{parts[0]}:</strong>{parts.slice(1).join(':')}</> // Apply bold to the part before the colon
            : option; // If no colon, show the whole option

        options.push(
            <div onChange={changeFunction}>
                <form>
                    <input required type="radio" value={option} id={option} name='option' checked={props.state[props.toChange] === option}/>
                    <label htmlFor={option} style={{marginLeft: '10px'}}>{labelContent}</label><br></br>
                </form>
            </div>
        );
    });

    return (
        <Card style={{ width: '70%', marginTop: '20px', textAlign: 'left', fontSize: 18}}>
            <Card.Body>
                <Card.Text>
                    <form>
                        <fieldset id={props.title}>
                            {options}
                        </fieldset>
                    </form>
                </Card.Text>
            </Card.Body>
        </Card>
    );
}

export default Likert;
