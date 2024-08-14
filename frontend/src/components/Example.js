import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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

const Example = ({ query, response1, response2, exampleAnnotation, setExampleAnnotation }) => {

    const descriptions = {
        relevance: [
            "The response is not relevant to the query.",
            "The response has minimal relevance, addressing some parts of the query but missing the main point.",
            "The response is somewhat relevant, addressing the main points but missing some details.",
            "The response is mostly relevant, covering almost all key aspects of the query.",
            "The response is completely relevant, fully addressing the query."
        ],
        helpfulness: [
            "The response is not helpful at all.",
            "The response provides limited help, missing key information or context.",
            "The response is somewhat helpful, providing some useful information but lacking thoroughness.",
            "The response is helpful, offering useful and relevant information with minor gaps.",
            "The response is extremely helpful, fully addressing the query and follow-up questions."
        ],
        depth: [
            "The response is very superficial, providing minimal detail and lacking depth.",
            "The response offers some details but lacks thoroughness and precision.",
            "The response provides adequate detail, covering the main points with some depth.",
            "The response is detailed and thorough, covering most aspects with significant depth.",
            "The response is highly detailed, precise, and thorough."
        ],
        factual_correctness: [
            "The response contains multiple factual errors and inconsistencies.",
            "The response has some factual inaccuracies but also contains correct information.",
            "The response is mostly factually accurate with a few minor errors.",
            "The response is factually accurate with only very minor, infrequent errors.",
            "The response is completely factually accurate and consistent with no errors."
        ],
        coherence: [
            "The response is disjointed and difficult to follow, with poor logical flow.",
            "The response has some logical flow but includes noticeable inconsistencies or jumps.",
            "The response is generally coherent but may have minor issues with flow or logical consistency.",
            "The response is coherent with a clear logical flow and only minor, infrequent issues.",
            "The response is completely coherent, with a logical and easy-to-follow structure."
        ],
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
        { title: "Relevance", key1: "relevance_1", key2: "relevance_2", description: "How closely does the response stay on topic and directly address the query?" },
        { title: "Helpfulness", key1: "helpfulness_1", key2: "helpfulness_2", description: "How useful is the response in answering the query, while accounting for any follow-up questions and answers?" },
        { title: "Depth", key1: "depth_1", key2: "depth_2", description: "How detailed and thorough is the response?" },
        { title: "Factual Correctness", key1: "factual_correctness_1", key2: "factual_correctness_2", description: "How factually accurate is the information provided in the response?" },
        { title: "Coherence", key1: "coherence_1", key2: "coherence_2", description: "How logically structured and easy to follow is the response?" },
    ];

    return (
        <div>
            <Card style={{ width: "70%" }} className="query-card">
                <Card.Body>
                    <Card.Title> {"Query:"} </Card.Title>
                    <Card.Text>
                        {<NewlineText text={query} />}
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
                                    {<NewlineText text={response1} />}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="response-card">
                            <Card.Body>
                                <Card.Title> {"Response 2:"} </Card.Title>
                                <Card.Text style={{ fontSize: '16px', textAlign: 'left' }}>
                                    {<NewlineText text={response2} />}
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


Example.propTypes = {
    query: PropTypes.string.isRequired,
    response1: PropTypes.string.isRequired,
    response2: PropTypes.string.isRequired,
    exampleAnnotation: PropTypes.object.isRequired,
    setExampleAnnotation: PropTypes.func.isRequired
};

export default Example;
