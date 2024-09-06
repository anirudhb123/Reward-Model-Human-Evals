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
    const mode = data[0].mode;
    const [seconds, setSeconds] = useState(new Date());
    const [currentExample, setCurrentExample] = useState(0);

    const emptyExample = {
        suitability_1: null,
        helpfulness_1: null,
        specificity_1: null,
        correctness_1: null,
        coherence_1: null,
        suitability_2: null,
        helpfulness_2: null,
        specificity_2: null,
        correctness_2: null,
        coherence_2: null,
        overall_preference: "",
        justification: "",
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
            requiredFields = ["overall_preference", "justification"];
        } else {
            requiredFields = [
                "suitability_1",
                "helpfulness_1",
                "specificity_1",
                "correctness_1",
                "coherence_1",
                "suitability_2",
                "helpfulness_2",
                "specificity_2",
                "correctness_2",
                "coherence_2",
                "justification"
            ];
        }
        const missing = requiredFields.filter(field => exampleAnnotation[field] === "" || exampleAnnotation[field] === null);
        if (data[currentExample].follow_up_qas && data[currentExample].follow_up_qas.length > 0) {
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
            <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18, backgroundColor: 'white' }}>
                <h3> Evaluating Language Model Responses (Main Task)</h3>
                <br></br>
                Hello, and thank you for participating in our study! We are a group of researchers at the <a href="https://allenai.org/" target="_blank" rel="noreferrer">Allen Institute for Artificial Intelligence (Ai2)</a>, working on developing better methods for evaluating the quality of text generated by AI models like ChatGPT.
                <br></br>
                <br></br>
                <b>Task Overview:</b><br></br><br></br>
                In this task, we ask you to evaluate AI model responses to queries that may be ambiguous or subjective in nature. 
                Imagine that these queries were posed by a real person X (such as a coworker or a friend), seeking information from an AI model. Your role is to assess how well the AI model's responses address these queries.<br /><br />
                Since the queries can be ambiguous or subjective, we asked follow-up questions to the person X about their query. These questions can be about the person's intent, background or preferences. Your evaluation should consider these follow-up questions and the person X's answers to them. For instance, a query might be <i>"What is the best way to cook pasta?"</i>, where the follow-up question might be <i>"Q: Would you like a step-by-step recipe or a general overview?"</i> and the person's answer might be <i>"A: Step-by-step recipe"</i>. In this case, a step-by-step recipe would be preferred in the response.<br /><br />
                {/* Each annotation task includes 2 examples:
                <ol>
                    <li> <b>Example 1</b>: You will be presented with a <b>query</b> from person X and <b>two AI model responses</b> to evaluate. </li>
                    <li> <b>Example 2</b>: You will see the same <b>query</b> along with up to 10 <b>follow-up questions</b> and the person X's <b>answers</b> to these questions, followed by <b>two AI model responses</b> to evaluate. These two responses will incorporate the person's answers to the follow-up questions.</li>
                </ol> */}
                Each annotation task includes an <b>example of either one of the following two types</b>:
                <ol>
                    <li> <b>Type I</b>: You will be presented with a <b>query</b> from person X and <b>two AI model responses</b> to evaluate. </li>
                    <li> <b>Type II</b>: You will see the same <b>query</b> along with up to 10 <b>follow-up questions</b> and the person X's <b>answers</b> to these questions, followed by <b>two AI model responses</b> to evaluate. These two responses try to incorporate the person's answers to the follow-up questions.</li>
                </ol>
                <b>Steps in the Annotation Task:</b><br></br><br></br>
                <ol>
                    <li>Read the query, follow-up questions & answers (if provided) and the two responses carefully.</li><br></br>
                    <li>(If follow-up QAs are provided) For each follow-up QA pair, evaluate whether the response incorporates the person's answer to the follow-up question. If the response incorporates this preference, select "Yes". Otherwise, select "No".</li><br></br>
                    For example, if the follow-up QA is "Do you prefer a detailed response?" and the response is detailed, select "Yes". If the response is not detailed, select "No".<br></br><br></br>
                    {mode === 'absolute' && (
                        <>
                        <li>Rate each response on a scale of 1 to 5 based on the following criteria:
                            <br></br>
                            <ul>
                                <li><b>Suitability</b>: How closely does the response follow the instructions from the query and the requirements specified in the follow-up QAs (if any)? <br />
                                * Note that the response does not need to be correct or detailed simply to be suitable, it simply needs to follow the instructions in the query and follow-up questions.</li>
                                <li><b>Helpfulness</b>: How useful do you think the user would find this response, given the query and preferences they specified in the follow-up QAs (if any)?</li>
                                <li><b>Specificity</b>: What is the level of detail of information in the response?</li>
                                <li><b>Correctness</b>: How accurate is the information provided in the response?</li>
                                <li><b>Coherence</b>: How logically structured and easy to follow is the response?</li>
                            </ul>
                        </li>
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
