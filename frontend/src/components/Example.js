import React, { useState, useEffect } from 'react';
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

    const descriptions = {
        instruction_following: [
            "The response does not follow the instructions at all.",
            "The response follows some instructions but misses key elements or misinterprets the query.",
            "The response follows most instructions but overlooks minor details or partially misinterprets the query.",
            "The response follows the instructions well, with only minor oversights.",
            "The response perfectly follows all instructions."
        ],
        depth: [
            "The response is very superficial, providing minimal detail and lacking depth.",
            "The response offers some details but lacks thoroughness and precision.",
            "The response provides adequate detail, covering the main points with some depth.",
            "The response is detailed and thorough, covering most aspects with significant depth.",
            "The response is highly detailed, precise, and thorough."
        ],
        coherence: [
            "The response is disjointed and difficult to follow, with poor logical flow.",
            "The response has some logical flow but includes noticeable inconsistencies or jumps.",
            "The response is generally coherent but may have minor issues with flow or logical consistency.",
            "The response is coherent with a clear logical flow and only minor, infrequent issues.",
            "The response is completely coherent, with a logical and easy-to-follow structure."
        ],
        completeness: [
            "The response addresses very few or none of the aspects of the query.",
            "The response addresses some aspects but misses significant parts of the query.",
            "The response addresses most aspects of the query but with some gaps.",
            "The response addresses all key aspects of the query with minor omissions.",
            "The response comprehensively addresses all aspects of the query with no omissions."
        ],
        factual_correctness: [
            "The response contains multiple factual errors and inconsistencies.",
            "The response has some factual inaccuracies but also contains correct information.",
            "The response is mostly factually accurate with a few minor errors.",
            "The response is factually accurate with only very minor, infrequent errors.",
            "The response is completely factually accurate and consistent with no errors."
        ]
    };

    const initialActiveDescriptions = Object.keys(exampleAnnotation).reduce((acc, key) => {
        if (key !== "overall_preference") {
            const baseKey = key.slice(0, -2);
            const value = exampleAnnotation[key];
            acc[key] = descriptions[baseKey][value - 1];
        }
        return acc;
    }, {});

    const [activeDescriptions, setActiveDescriptions] = useState(initialActiveDescriptions);

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            {props}
        </Tooltip>
    );

    const handleSliderChange = (propertyKey, value) => {
        console.log(`Slider changed: ${propertyKey} to value ${value}`); // Debugging line
        setExampleAnnotation(prevState => ({
            ...prevState,
            [propertyKey]: value
        }));
        const baseKey = propertyKey.slice(0, -2);
        setActiveDescriptions(prevState => ({
            ...prevState,
            [propertyKey]: descriptions[baseKey][value - 1]
        }));
    };

    const properties = [
        { title: "Instruction Following", key1: "instruction_following_1", key2: "instruction_following_2", description: "How well does the response follow all the instructions specified in the query as well as the follow-up questions?" },
        { title: "Depth", key1: "depth_1", key2: "depth_2", description: "How precise and thorough are the details in the response?" },
        { title: "Coherence", key1: "coherence_1", key2: "coherence_2", description: "How would you rate the logical flow of the response?" },
        { title: "Completeness", key1: "completeness_1", key2: "completeness_2", description: "How well does the response address all aspects of the query and follow-up questions?" },
        { title: "Factual Correctness", key1: "factual_correctness_1", key2: "factual_correctness_2", description: "How factually accurate and consistent is the information presented in the response?" },
    ];

    return (
        <div>
            <Card style={{ width: "70%" }} className="query-card">
                <Card.Body>
                    <Card.Title> {"Query:"} </Card.Title>
                    <Card.Text>
                        {<NewlineText text={props.query} />}
                    </Card.Text>
                </Card.Body>
            </Card>

            <Container fluid style={{ marginTop: '20px', width: "70%" }} className="responses-container">
                <Row>
                    <Col>
                        <Card className="response-card">
                            <Card.Body>
                                <Card.Title> {"Response 1:"} </Card.Title>
                                <Card.Text style={{ fontSize: '16px', textAlign: 'left' }}>
                                    {<NewlineText text={props.response1} />}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="response-card">
                            <Card.Body>
                                <Card.Title> {"Response 2:"} </Card.Title>
                                <Card.Text style={{ fontSize: '16px', textAlign: 'left' }}>
                                    {<NewlineText text={props.response2} />}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            <Container fluid style={{ marginTop: '20px', width: "85%", marginLeft: 'auto', marginRight: 'auto' }}>
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
                                onChange={(value) => handleSliderChange(property.key1, value)}
                            />
                            <p>{activeDescriptions[property.key1]}</p>
                        </Col>
                        <Col xs={5}>
                            <Slider
                                state={exampleAnnotation}
                                setState={setExampleAnnotation}
                                toChange={property.key2}
                                onChange={(value) => handleSliderChange(property.key2, value)}
                            />
                            <p>{activeDescriptions[property.key2]}</p>
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
