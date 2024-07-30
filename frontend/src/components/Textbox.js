import React from 'react'
import {Card} from 'react-bootstrap';

function NewlineText({ text }) {
    const newText = text.split('\n').map((str, index, array) => 
      index === array.length - 1 ? str : <>
        {str}
        <br />
      </>
    );
  
    return <>{newText}</>;
}

const Textbox = (props) => {
    return (
        <Card style={{ width: '80%', marginTop: '20px', textAlign: 'left'}}>
            <Card.Body>
                <Card.Title style={{ fontWeight: 'bold !important' }}> {props.title + ":"} </Card.Title>
                <Card.Text>
                    {<NewlineText text={props.text} />}
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Textbox 