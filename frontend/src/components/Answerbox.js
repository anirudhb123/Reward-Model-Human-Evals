import React from 'react'
import {Card} from 'react-bootstrap';

const Answerbox= (props) => {
    const redDot = () => {
        return <></>
    }
    return (
    <Card style={{ width: '40rem', marginTop: '20px', textAlign: 'left'}}>
        <Card.Body>
            <Card.Title>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    {props.text}
                    {redDot()}
                </div>
            </Card.Title>
        </Card.Body>
    </Card>
    )
}

export default Answerbox