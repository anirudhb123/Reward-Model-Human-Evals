import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

const OverallPreference = (props) => {
    const handleChange = (event) => {
        const newState = {
            ...props.state,
        };
        newState[props.toChange] = event.target.value;
        props.setState(newState);
    };

    return (
        <Card style={{ width: '75%', margin: '20px auto', padding: '20px' }} className="overall-preference-card">
            <Card.Body>
                <Form>
                    <Form.Group as={Row} style={{ alignItems: 'center', fontSize: '1.2rem' }}>
                        <Col xs={3} style={{ fontSize: '1.5rem' }}><strong>Overall Preference:</strong></Col>
                        <Col style={{ display: 'flex', justifyContent: 'space-around', fontSize: '1.5rem' }}>
                            <Form.Check 
                                type="radio"
                                id="response1"
                                name="overall_preference"
                                value="Response 1"
                                label="Response 1"
                                onChange={handleChange}
                                checked={props.state[props.toChange] === 'Response 1'}
                                inline
                                className="custom-radio"
                            />
                            <Form.Check 
                                type="radio"
                                id="response2"
                                name="overall_preference"
                                value="Response 2"
                                label="Response 2"
                                onChange={handleChange}
                                checked={props.state[props.toChange] === 'Response 2'}
                                inline
                                className="custom-radio"
                            />
                            <Form.Check 
                                type="radio"
                                id="tie"
                                name="overall_preference"
                                value="Tie"
                                label="Tie"
                                onChange={handleChange}
                                checked={props.state[props.toChange] === 'Tie'}
                                inline
                                className="custom-radio"
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default OverallPreference;
