import { useState, useEffect } from "react";
import "./pagesStyle.css";
import Example from "../components/Example";
import { Button, Alert, ProgressBar } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AnnotationPage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state.data;  // Ensure 'data' is provided via location state.
    const [seconds, setSeconds] = useState(new Date());  // Initialize with a new Date object.
    const [currentExample, setCurrentExample] = useState(0);
    const emptyExample = {
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
    };
    const [exampleAnnotation, setExampleAnnotation] = useState(emptyExample);
    const [missingFields, setMissingFields] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(new Date());  // Update every second if necessary, else remove.
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleButtonAction = () => {
        return (() => {
            if (missingFields.length > 0) {
                setMissingFields([]);
            }
            const endTime = new Date();

            axios
                .patch(`/api/annotate/example/${data[currentExample]._id}`, {
                    completed: true,
                    time_spent: endTime - seconds,
                    instruction_following_1: exampleAnnotation.instruction_following_1,
                    depth_1: exampleAnnotation.depth_1,
                    coherence_1: exampleAnnotation.coherence_1,
                    completeness_1: exampleAnnotation.completeness_1,
                    factual_correctness_1: exampleAnnotation.factual_correctness_1,
                    instruction_following_2: exampleAnnotation.instruction_following_2,
                    depth_2: exampleAnnotation.depth_2,
                    coherence_2: exampleAnnotation.coherence_2,
                    completeness_2: exampleAnnotation.completeness_2,
                    factual_correctness_2: exampleAnnotation.factual_correctness_2,
                    overall_preference: exampleAnnotation.overall_preference,
                })
                .then((response) => {
                    // console.log(response)
                })
                .catch((error) => console.log(error));

            // rescroll & state updates
            setSeconds(endTime);
            window.scrollTo(0, 0);

            if (currentExample + 1 === data.length) {
                setExampleAnnotation(emptyExample);
                navigate("/submission");
            }
            else {
                setCurrentExample(currentExample + 1);
            }
        })();
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
                style={{ marginLeft: "20px", fontSize: "20px"}}
                onClick={handleButtonAction}
            >
                {currentExample < data.length - 1 ? "Submit Example" : "Submit Final Example"}
            </Button>
        );
    };

    return (
        <div align="center">
            <Alert style={{ width: "90%", marginTop: "20px", textAlign: "left", fontSize: 18}}>
                <h3> Evaluating Language Model Responses </h3>
                <br></br>
                Hello, and thank you for participating in our study! We are a group of researchers at the <a href="https://allenai.org/" target="_blank" rel="noreferrer">Allen Institute for Artificial Intelligence (AI2)</a> building better methods for evaluating the quality of text generated by language models like ChatGPT.
                <br></br>
                <br></br>
                In this task, we would like your help in <b>evaluating AI model responses to queries</b> issued by users.
                You will be given a query, and optionally, user responses to follow-up questions about the query, and two responses generated by an AI model. Your task is to rate the responses on a scale of 1-5 on the following criteria:
                <br></br><br></br>
                <ul>
                    <li><b>Instruction Following</b>: How well does the response follow all the instructions specified in the query as well as the follow-up questions?</li>
                    <li><b>Depth</b>: How precise and thorough are the details in the response?</li>
                    <li><b>Coherence</b>: How would you rate the logical flow of the response?</li>
                    <li><b>Completeness</b>: How well does the response address all aspects of the query and follow-up questions?</li>
                    <li><b>Factual Correctness</b>: How factually accurate and consistent is the information presented in the response?</li>
                </ul>
                
                After evaluating the responses, please provide an <b>overall preference</b> for one of the two responses. If you find both responses equally good, you can select "Tie".
                <br></br>
                Current Example: {currentExample + 1} out of {data.length}
                <ProgressBar
                    variant="primary"
                    now={((currentExample + 1) * 100.0) / data.length}
                    style={{ width: "38rem", marginTop: "20px", marginBottom: "20px" }}
                />
                Make sure to <b>follow the instructions carefully</b> and submit all the examples! If an error occurs in the interface, just click on the link again and enter your ID.
            </Alert>
            <Example
                query={data[currentExample].query}
                response1={data[currentExample].response1}
                response2={data[currentExample].response2}
                exampleAnnotation={exampleAnnotation}
                setExampleAnnotation={setExampleAnnotation}
            />
            {renderAlert()}
            <div className="buttons">{renderButton()}</div>
        </div>
    );
};

export default AnnotationPage;
