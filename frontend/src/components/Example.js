import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Container, Row, Col, OverlayTrigger, Tooltip, Form } from 'react-bootstrap';
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

/*     const descriptions = {
        suitability: [
            "The response does not address the query at all.",
            "The response addresses the query very minimally, missing the core aspects.",
            "The response somewhat addresses the query, covering some important points but lacking key details.",
            "The response mostly addresses the query, with minor omissions.",
            "The response fully addresses the query, covering all key aspects."
        ],
        helpfulness: [
            "The response is not helpful in addressing the query.",
            "The response provides limited help, missing important context or useful information.",
            "The response is somewhat helpful, offering useful information but lacking specific details.",
            "The response is helpful, covering most of the query adequately.",
            "The response is highly helpful, fully addressing the query with thorough and useful information."
        ],
        specificity: [
            "The response is very shallow, providing minimal information or detail.",
            "The response offers some detail but is largely superficial and lacks detail.",
            "The response provides an adequate level of detail, covering the main points with moderate detail.",
            "The response is detailed, covering most aspects of the query with significant detail.",
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
 */
    let split_query;
    split_query = query

  /*   const initialActiveDescriptions = Object.keys(exampleAnnotation).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {});


    const [activeDescriptions, setActiveDescriptions] = useState(initialActiveDescriptions);

    */

    const renderTooltip = (props) => (
        <Tooltip {...props}>
            {props}
        </Tooltip>
    );

    // const handleSliderChange = (propertyKey, value) => {
    //     setExampleAnnotation(prevState => ({
    //         ...prevState,
    //         [propertyKey]: value
    //     }));
    //     const baseKey = propertyKey.slice(0, -2);
    //     setActiveDescriptions(prevState => ({
    //         ...prevState,
    //         [propertyKey]: descriptions[baseKey][value - 1]
    //     }));
    // };

    const handleJustificationChange = (event) => {
       const value = event.target.value;
       setExampleAnnotation(prevState => ({
           ...prevState,
           justification: value
       }));

       console.log(exampleAnnotation)
    };

    const properties = [
        { title: "Suitability", key1: "suitability_1", key2: "suitability_2", description: "How suitable is the response in directly addressing the query?" },
        { title: "Helpfulness", key1: "helpfulness_1", key2: "helpfulness_2", description: "How useful do you think the user would find this response?" },
        { title: "Specificity", key1: "specificity_1", key2: "specificity_2", description: "What is the level of detail of information in the response?" },
        { title: "Correctness", key1: "correctness_1", key2: "correctness_2", description: "How accurate is the information provided in the response?" },
        { title: "Coherence", key1: "coherence_1", key2: "coherence_2", description: "How logically structured and easy to follow is the response?" },
    ];

    return (
        <div>
            <Card style={{ width: "70%", backgroundColor: '#AED5B3' }} className="query-card">
                <Card.Body>
                    <Card.Title> {"Query:"} </Card.Title>
                    <Card.Text>
                    {<NewlineText text={split_query} />}
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

{             (
                <OverallPreference
                title="Overall Preference"
                state={exampleAnnotation} 
                setState={setExampleAnnotation}  // This should be the state setter function
                toChange="overall_preference"    // This should match the key in the state object
                />
            ) }

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
    reward_model_preferred_response: PropTypes.string.isRequired
};

export default Example;
