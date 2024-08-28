import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Row, Col, OverlayTrigger, Tooltip, Form, Table } from 'react-bootstrap';
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

const Example = ({ query, response1, response2, exampleAnnotation, setExampleAnnotation, mode, follow_up_qas, currentExample }) => {

    const descriptions = {
        suitability: [
            "The response does not address the query or follow-up questions at all.",
            "The response addresses the query or follow-up questions very minimally, missing the core aspects.",
            "The response somewhat addresses the query or follow-up questions, covering some important points but lacking key details.",
            "The response mostly addresses the query or follow-up questions, with minor omissions.",
            "The response fully addresses the query or follow-up questions, covering all key aspects."
        ],
        helpfulness: [
            "The response is not helpful in addressing the query or follow-up questions.",
            "The response provides limited help, missing important context or useful information.",
            "The response is somewhat helpful, offering useful information but lacking specific details.",
            "The response is helpful, covering most of the query or follow-up questions adequately.",
            "The response is highly helpful, fully addressing the query or follow-up questions with thorough and useful information."
        ],
        specificity: [
            "The response is very shallow, providing minimal information or detail.",
            "The response offers some detail but is largely superficial and lacks detail.",
            "The response provides an adequate level of detail, covering the main points with moderate detail.",
            "The response is detailed, covering most aspects of the query or follow-up questions with significant detail.",
            "The response is very specific, covering all aspects with great detail."
        ],
        correctness: [
            "The response contains multiple errors or inaccuracies.",
            "The response has some inaccuracies, though it also includes some correct information.",
            "The response is mostly accurate with only a few minor errors.",
            "The response is accurate with very minor and infrequent errors.",
            "The response is entirely accurate, with no errors."
        ],
        coherence: [
            "The response is incoherent, with poor logical flow or difficult to understand.",
            "The response has some coherence, but includes noticeable inconsistencies or logical gaps.",
            "The response is generally coherent, but may have minor issues with flow or clarity.",
            "The response is coherent, with a clear logical flow and only minor issues.",
            "The response is completely coherent, with a clear, logical, and easy-to-follow structure."
        ],
    };

    const queryEnd = query.indexOf('Follow-Up Questions and Answers:');
    let split_query;
    if (queryEnd !== -1) {
        split_query = query.slice(0, queryEnd).trim();
    } else {
        split_query = query.trim();
    }

    const initialActiveDescriptions = Object.keys(exampleAnnotation).reduce((acc, key) => {
        if (mode === "absolute" && key in descriptions ) {
            const baseKey = key.slice(0, -2);
            const value = exampleAnnotation[key];
            if (value !== null && value !== undefined) {  // Check for null or undefined
                console.log(baseKey, value);
                acc[key] = descriptions[baseKey][value - 1];
            } else {
                acc[key] = null;  // Set to null if the value is null or undefined
            }
        } else {
            acc[key] = null;
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

    const handleRadioChange = (qaIndex, responseKey, value) => {
        const updatedFollowUpQAs = [...follow_up_qas];
        updatedFollowUpQAs[qaIndex][responseKey] = value;
        console.log(updatedFollowUpQAs);
        setExampleAnnotation(prevState => ({
            ...prevState,
            follow_up_qas: updatedFollowUpQAs
        }));
    };

    const handleJustificationChange = (event) => {
        const value = event.target.value;
        setExampleAnnotation(prevState => ({
            ...prevState,
            justification: value
        }));
    };

    const properties = [
        { title: "Suitability", key1: "suitability_1", key2: "suitability_2", description: "How suitable is the response in directly addressing the query and the requirements specified in the follow-up QAs (if any)?" },
        { title: "Helpfulness", key1: "helpfulness_1", key2: "helpfulness_2", description: "How useful do you think the user would find this response, given the preferences they specified in the query and follow-up QAs?" },
        { title: "Specificity", key1: "specificity_1", key2: "specificity_2", description: "What is the level of detail of information in the response?" },
        { title: "Correctness", key1: "correctness_1", key2: "correctness_2", description: "How accurate is the information provided in the response?" },
        { title: "Coherence", key1: "coherence_1", key2: "coherence_2", description: "How logically structured and easy to follow is the response?" },
    ];

    return (
        <div>
            <Card style={{ width: "70%", backgroundColor: '#AED5B3'}} className="query-card">
                <Card.Body>
                    <Card.Title> {"Query:"} </Card.Title>
                    <Card.Text>
                        {<NewlineText text={split_query} />}
                    </Card.Text>
                </Card.Body>
            </Card>

            {follow_up_qas && follow_up_qas.length > 0 && (
                <Container fluid style={{ marginTop: '20px', width: "70%", marginLeft: 'auto', marginRight: 'auto' }}>
                    <Card style={{ width: "100%", backgroundColor: '#AED5B3'}} className="query-card">
                        <Card.Body>
                        <Card.Title> {"Follow-Up Questions and Answers:"} </Card.Title>
                        <Card.Title>
                            {"This is a Type II example as it contains follow-up questions about the query and the person X's answers to these questions."}
                            <br />
                            {"Do the responses incorporate the answer to each follow-up question?"}
                        </Card.Title>
                        </Card.Body>
                    </Card><br />
                    <Table bordered hover>
                        <tbody>
                            {follow_up_qas.map((qaPair, index) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td colSpan={3} style={{ backgroundColor: '#f8f9fa', textAlign: 'center', verticalAlign: 'middle', border: '2px solid #dee2e6' }}>
                                            <h6 style={{ margin: '10px 0' }}>{qaPair.qa}</h6>
                                        </td>
                                    </tr>
                                    {/* Response Options aligned under each response */}
                                    <tr>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', border: '2px solid #dee2e6' }}>
                                        <p style={{display:'inline'}}>Response 1:  </p>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name={`satisfied_1_${index}`}
                                                id={`satisfied_1_${index}`}
                                                value={true}
                                                // checked={qaPair.satisfied_1 === true}
                                                onChange={() => handleRadioChange(index, 'satisfied_1', true)}
                                                inline
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name={`satisfied_1_${index}`}
                                                id={`not_satisfied_1_${index}`}
                                                value={false}
                                                // checked={qaPair.satisfied_1 === false}
                                                onChange={() => handleRadioChange(index, 'satisfied_1', false)}
                                                inline
                                            />
                                        </td>
                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', border: '2px solid #dee2e6' }}>
                                        <p style={{display:'inline'}}>Response 2:  </p>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name={`satisfied_2_${index}`}
                                                id={`satisfied_2_${index}`}
                                                value={true}
                                                // checked={qaPair.satisfied_2 === true}
                                                onChange={() => handleRadioChange(index, 'satisfied_2', true)}
                                                inline
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name={`satisfied_2_${index}`}
                                                id={`not_satisfied_2_${index}`}
                                                value={false}
                                                // checked={qaPair.satisfied_2 === false}
                                                onChange={() => handleRadioChange(index, 'satisfied_2', false)}
                                                inline
                                            />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </Table>
                </Container>
            )}

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

            {mode === 'absolute' && (
                <Container fluid style={{ marginTop: '20px', width: "85%", marginLeft: 'auto', marginRight: 'auto' }}>
                    <Card style={{ width: "80%", backgroundColor: '#AED5B3'}} className="query-card">
                        <Card.Body>
                            <Card.Title> {"Now rate the above two responses on the following criteria."} </Card.Title>
                        </Card.Body>
                    </Card><br />
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
            )}

            {mode === 'pairwise' && (
                <OverallPreference
                    title="Overall Preference"
                    state={exampleAnnotation}
                    setState={setExampleAnnotation}
                    toChange="overall_preference"
                />
            )}

            <Container fluid style={{ marginTop: '20px', width: "70%" }}>
                <Form.Group controlId="justification">
                    <Form.Label style={{ textAlign: 'left', fontSize: '20px' }}>Justification: Please provide a brief (2-3 sentences) reason for your judgement of the responses. <b>Note that this is important as we will be unable to interpret your judgements without these justifications.</b></Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Justification of your judgement."
                        value={exampleAnnotation.justification || ''}
                        onChange={handleJustificationChange}
                    />
                </Form.Group>
            </Container>
        </div>
    );
};


Example.propTypes = {
    query: PropTypes.string.isRequired,
    response1: PropTypes.string.isRequired,
    response2: PropTypes.string.isRequired,
    exampleAnnotation: PropTypes.object.isRequired,
    setExampleAnnotation: PropTypes.func.isRequired,
    mode: PropTypes.string.isRequired,  // Add mode prop
    follow_up_qas: PropTypes.arrayOf(
        PropTypes.shape({
            qa: PropTypes.string.isRequired,
            satisfied_1: PropTypes.bool,
            satisfied_2: PropTypes.bool,
        })
    ).isRequired
};

export default Example;
