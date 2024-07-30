import React, { useState } from 'react';
import { Card, Container, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Slider from "./Slider";
import OverallPreference from "./OverallPreference";
import "./componentStyle.css";

function NewlineText({ text }) {
    const newText = text.split('\n').map((str, index, array) =>
        index === array.length - 1 ? str : <>
            {str}
            <br />
        </>
    );
    return <>{newText}</>;
}

const Example = (props) => {
    const [exampleAnnotation, setExampleAnnotation] = useState({
        instruction_following_1: 3,
        depth_1: 3,
        coherence_1: 3,
        completeness_1: 3,
        factual_correctness_1: 3,
        instruction_following_2: 3,
        depth_2: 3,
        coherence_2: 3,
        completeness_2: 3,
        factual_correctness_2: 3,
        overall_preference: "",
    });

    const renderTooltip = (props) => (
      <Tooltip {...props}>
        {props}
      </Tooltip>
    );

    const properties = [
        { title: "Instruction Following", key1: "instruction_following_1", key2: "instruction_following_2", description: "How well does the response follow all the instructions specified in the query as well as the follow-up questions?" },
        { title: "Depth", key1: "depth_1", key2: "depth_2", description: "How precise and thorough are the details in the response?" },
        { title: "Coherence", key1: "coherence_1", key2: "coherence_2", description: "How would you rate the logical flow of the response?" },
        { title: "Completeness", key1: "completeness_1", key2: "completeness_2", description: "How well does the response address all aspects of the query and follow-up questions?" },
        { title: "Factual Correctness", key1: "factual_correctness_1", key2: "factual_correctness_2", description: "How factually accurate and consistent is the information presented in the response?" },
    ];

    return (
        <div>
            <Card style={{ width: "90%" }} className="query-card">
                <Card.Body>
                    <Card.Title> {"Query:"} </Card.Title>
                    <Card.Text>
                        {<NewlineText text={props.query} />}
                    </Card.Text>
                </Card.Body>
            </Card>

            <Container fluid style={{ marginTop: '20px', width: "75%" }} className="responses-container">
                <Row>
                    <Col>
                        <Card className="response-card">
                            <Card.Body>
                                <Card.Title> {"Response 1:"} </Card.Title>
                                <Card.Text>
                                    {<NewlineText text={props.response1} />}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="response-card">
                            <Card.Body>
                                <Card.Title> {"Response 2:"} </Card.Title>
                                <Card.Text>
                                    {<NewlineText text={props.response2} />}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Container fluid style={{ marginTop: '20px', width: "90%", marginLeft: 'auto', marginRight: 'auto' }}>
                {properties.map((property) => (
                    <Row key={property.title} style={{ alignItems: 'center', marginBottom: '20px' }}>
                        <OverlayTrigger overlay={renderTooltip(property.description)}>
                        <Col xs={1}><h5>{property.title}</h5></Col>
                        </OverlayTrigger>
                        <Col xs={5}>
                            <Slider
                                state={exampleAnnotation}
                                setState={setExampleAnnotation}
                                toChange={property.key1}
                            />
                        </Col>
                        <Col xs={5}>
                            <Slider
                                state={exampleAnnotation}
                                setState={setExampleAnnotation}
                                toChange={property.key2}
                            />
                        </Col>
                    </Row>
                ))}
            </Container>

            <OverallPreference
                title="Overall Preference"
                state={exampleAnnotation}
                setState={setExampleAnnotation}
                toChange="overall_preference"
            />
        </div>
    );
};

export default Example;
