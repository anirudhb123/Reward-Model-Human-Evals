import { useState, useEffect } from "react";
import "./pagesStyle.css";
import Example from "../components/Example";
import { Button, Alert, ProgressBar } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AnnotationPage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state.data;
    const annotatorId = location.state.annotatorId;
    const mode = data[0].mode;  // Get mode from location state
    const [seconds, setSeconds] = useState(new Date());
    const [currentExample, setCurrentExample] = useState(0);

    const emptyExample = {
        relevance_1: mode === 'absolute' ? 3 : null,
        helpfulness_1: mode === 'absolute' ? 3 : null,
        depth_1: mode === 'absolute' ? 3 : null,
        factual_correctness_1: mode === 'absolute' ? 3 : null,
        coherence_1: mode === 'absolute' ? 3 : null,
        relevance_2: mode === 'absolute' ? 3 : null,
        helpfulness_2: mode === 'absolute' ? 3 : null,
        depth_2: mode === 'absolute' ? 3 : null,
        factual_correctness_2: mode === 'absolute' ? 3 : null,
        coherence_2: mode === 'absolute' ? 3 : null,
        overall_preference: "",
    };

    const [exampleAnnotation, setExampleAnnotation] = useState(emptyExample);
    const [missingFields, setMissingFields] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setExampleAnnotation(emptyExample);
    }, [currentExample]);

    const validateAnnotations = () => {
        let requiredFields = [];
        if (mode === 'pairwise') {
            requiredFields = ["overall_preference"];
        } else {
            requiredFields = [
                "relevance_1",
                "helpfulness_1",
                "depth_1",
                "factual_correctness_1",
                "coherence_1",
                "relevance_2",
                "helpfulness_2",
                "depth_2",
                "factual_correctness_2",
                "coherence_2",
            ];
        }
        const missing = requiredFields.filter(field => exampleAnnotation[field] === "" || exampleAnnotation[field] === null);
        if (currentExample === 1) {
            // TODO: Add validation for follow-up QAs
            // Validation for follow-up QAs
            data[currentExample].follow_up_qas.forEach((qa, index) => {
            if (qa.satisfied_1 === "" || qa.satisfied_1 === null) {
                missing.push(`Follow-up QA ${index + 1} (Response 1)`);
            }
            if (qa.satisfied_2 === "" || qa.satisfied_2 === null) {
                missing.push(`Follow-up QA ${index + 1} (Response 2)`);
            }
            });
        }

        setMissingFields(missing);

        return missing.length === 0;
    };

    const handleButtonAction = () => {
        if (!validateAnnotations()) {
            return;
        }

        const endTime = new Date();
        const timeSpent = endTime - seconds;
        const updateData = {
            completed: true,
            time_spent: timeSpent,
            ...exampleAnnotation,
            annotator_id: annotatorId,
            mode: mode
        };

        axios
            .patch(`/api/annotate/example/${data[currentExample]._id}`, updateData)
            .then((response) => {
                console.log('Data saved:', response.data);
            })
            .catch((error) => {
                console.error('Error saving data:', error);
            });

        setSeconds(endTime);
        window.scrollTo(0, 0);

        if (currentExample + 1 === data.length) {
            setCurrentExample(0);
            navigate("/submission");
        } else {
            setCurrentExample(currentExample + 1);
        }
    };

    const renderAlert = () => {
        if (missingFields.length > 0) {
            return (
                <Alert variant="danger" style={{ width: "70%", marginTop: "20px", textAlign: "left" }}>
                    Please submit the following required fields before submitting: {missingFields.join(", ")}
                </Alert>
            );
        }
    };

    const renderButton = () => {
        return (
            <Button
                variant="outline-primary"
                style={{ marginLeft: "20px", fontSize: "20px" }}
                onClick={handleButtonAction}
            >
                {currentExample < data.length - 1 ? "Submit Example" : "Submit Final Example"}
            </Button>
        );
    };

    return (
        <div align="center">
            <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18 }}>
                <h3> Evaluating Language Model Responses </h3>
                <br></br>
                Hello, and thank you for participating in our study! We are a group of researchers at the <a href="https://allenai.org/" target="_blank" rel="noreferrer">Allen Institute for Artificial Intelligence (Ai2)</a>, working on developing better methods for evaluating the quality of text generated by AI models like ChatGPT.
                <br></br>
                <br></br>
                <b>Task Overview:</b><br></br><br></br>
                In this task, we ask you to evaluate AI model responses to queries that may be ambiguous or subjective in nature. 
                Imagine that these queries were posed by a real person (such as a coworker or a friend), seeking information from an AI model. Your role is to assess how well the AI model's responses address these queries.<br /><br />
                Each annotation task includes 2 examples:
                <ol>
                    <li> <b>Example 1</b>: You will be presented with a <b>query</b> and <b>two AI model responses</b> to evaluate. </li>
                    <li> <b>Example 2</b>: You will see the same <b>query</b> along with <b>follow-up questions</b> and the person's <b>answers</b> to these questions, followed by <b>two AI model responses</b> to evaluate.</li>
                </ol>
                <b>Steps in the Annotation Task:</b><br></br><br></br>
                <ol>
                    <li>Read the query, follow-up questions & answers (if provided) and the two responses carefully.</li><br></br>
                    <li>(If follow-up QAs are provided) For each follow-up QA pair, evaluate whether the response incorporates the preference in the question-answer. If the response incorporates this preference, select "Yes". Otherwise, select "No".</li><br></br>
                    {mode === 'absolute' && (
                        <>
                        <li>Rate each response on a scale of 1 to 5 based on the following criteria:
                            <br></br>
                            <ul>
                                <li><b>Relevance</b>: How well does the response directly address the query and the requirements specified in the follow-up QAs (if any)? 
                                * Note that the response does not need to be correct or detailed simply to be relevant.</li>
                                <li><b>Helpfulness</b>: How useful do you think the user would find this response, given the query and preferences they specified in the follow-up QAs (if any)?</li>
                                <li><b>Depth</b>: How detailed and thorough is the response?</li>
                                <li><b>Factual Correctness</b>: How factually accurate is the information provided in the response?</li>
                                <li><b>Coherence</b>: How logically structured and easy to follow is the response?</li>
                            </ul>
                        </li><br></br>
                        </>
                    )}
                    {mode === 'pairwise' && (
                        <>
                        <li>Finally, indicate your <b>overall preference</b> for one of the two responses. If you find both responses equal in quality, you can select "Tie".</li>
                        </>
                    )}
                </ol>
                <br />
                Your thoughtful evaluations will help us better understand and improve the performance of AI models. Thank you for your participation!
                <br></br><br></br>
                Current Example: {currentExample + 1} out of {data.length}
                <ProgressBar
                    variant="primary"
                    now={((currentExample + 1) * 100.0) / data.length}
                    style={{ width: "38rem", marginTop: "20px", marginBottom: "20px" }}
                />
                <b>Important Note</b>: Make sure to <b>follow the instructions carefully</b> and submit all the examples!<br></br>
                <b>If you do not understand the query or if an error occurs in the interface, just go to the link again, enter your ID and you will be shown a different query.</b>
            </Alert>
            <Example
                query={data[currentExample].query}
                response1={data[currentExample].response1}
                response2={data[currentExample].response2}
                exampleAnnotation={exampleAnnotation}
                setExampleAnnotation={setExampleAnnotation}
                mode={mode}
                follow_up_qas={data[currentExample].follow_up_qas}
                currentExample={currentExample}
            />
            {renderAlert()}
            <div className="buttons">{renderButton()}</div>
        </div>
    );
};

export default AnnotationPage;
