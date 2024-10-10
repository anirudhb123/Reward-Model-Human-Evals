import { useState, useEffect } from "react";
import "./pagesStyle.css";
import Example from "../components/Example";
import { Button, Alert, ProgressBar } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import MultiSelectCheckbox from '../components/MultiSelectCheckbox';

const AnnotationPage = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state.data;
    const annotatorId = location.state.annotatorId;
    const mode = data[0].mode;
    const [seconds, setSeconds] = useState(new Date());
    const [currentExample, setCurrentExample] = useState(0);

    const emptyExample = {
        /* suitability_1: null,
        helpfulness_1: null,
        specificity_1: null,
        correctness_1: null,
        coherence_1: null,
        suitability_2: null,
        helpfulness_2: null,
        specificity_2: null,
        correctness_2: null,
        coherence_2: null, */
        overall_preference: "",
        justification: "",
    };

    const [exampleAnnotation, setExampleAnnotation] = useState(emptyExample);
    const [missingFields, setMissingFields] = useState([]);
    const [selectedValues, setSelectedValues] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setExampleAnnotation(emptyExample);
    }, [currentExample]);

    useEffect(() => {
        setSelectedValues([]);
    }, [currentExample]);

    const validateAnnotations = () => {
        let requiredFields = [];
        requiredFields = ["overall_preference"];
       
        const missing = requiredFields.filter(field => exampleAnnotation[field] === "" || exampleAnnotation[field] === null);
        /* if (data[currentExample].follow_up_qas && data[currentExample].follow_up_qas.length > 0) {
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
 */
        
        setMissingFields(missing);
        return missing.length === 0 && selectedValues.length !== 0;
    };

    const handleButtonAction = () => {
        if (!validateAnnotations()) {
            console.log(exampleAnnotation)
            return;
        }

        const endTime = new Date();
        const timeSpent = endTime - seconds;
        const updateData = {
            query_id: data[currentExample]._id,
            completed: true,
            selectedValues: selectedValues,
            time_spent: timeSpent,
            ...exampleAnnotation,
            annotator_id: annotatorId,
            mode: mode
        };

        axios
            .post(`/api/annotate/example/${data[currentExample]._id}`, updateData)
            .then((response) => {
                console.log('Data saved:', updateData);
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

    const handleSelectionChange = (event) => {
        const inputValue = event.target.value;
        console.log('Input value:', inputValue);
        setSelectedValues(inputValue); // Update the state with the new text value
    };
    

    return (
        <div align="center">
            <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18, backgroundColor: 'white' }}>
                <h3> Evaluating Language Model Responses (Main Task)</h3>
                <br></br>
                Hello, and thank you for participating in our study! We are a group of researchers at the University of Pennsylvania, working on better understanding the biases present in reward models used to train AI models like ChatGPT.
                <br></br>
                <br></br>
                <b>Task Overview:</b><br></br><br></br>
                In this task, we ask you to evaluate AI model responses to queries that may be ambiguous or subjective in nature. 
                Imagine that these queries were posed by a real person X (such as a coworker or a friend), seeking information from an AI model. Your role is to evaluate how well each response addresses the queries and decide which one is better.<br /><br />
                {/* Each annotation task includes 2 examples:
                <ol>
                    <li> <b>Example 1</b>: You will be presented with a <b>query</b> from person X and <b>two AI model responses</b> to evaluate. </li>
                    <li> <b>Example 2</b>: You will see the same <b>query</b> along with up to 10 <b>follow-up questions</b> and the person X's <b>answers</b> to these questions, followed by <b>two AI model responses</b> to evaluate. These two responses will incorporate the person's answers to the follow-up questions.</li>
                </ol> */}
                For each annotation task, you will be presented with a <b>query</b> from person X and <b>two AI model responses</b> to evaluate. Then, indicate your <b>overall preference</b> for one of the two responses. If you find both responses equal in quality, you can select "Tie". We also ask that you provide some reasons as to why you preferred one response to the other (if you selected "Tie", you can provide reasons for why you thought the responses were of equal quality).
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
                query={data[currentExample].question}
                response1={data[currentExample]['response 1']}
                response2={data[currentExample]['response 2']}
                exampleAnnotation={exampleAnnotation}
                setExampleAnnotation={setExampleAnnotation}
                // mode={mode}
                // currentExample={currentExample}
            />

            {/* <MultiSelectCheckbox
            key={currentExample} 
            options={['Responses Were of Equal Quality', 'More Relevant', 'Easier to Understand', 'More Concise', 'Better Structure']}
            title="Reasons Chosen Response was Preferred"
            onSelectionChange={handleSelectionChange}
            /> */}

            <textarea
                key={currentExample}
                placeholder="Enter your reasons for preferring your chosen response."
                title="Reasons Chosen Response was Preferred"
                onChange={handleSelectionChange}
                value={selectedValues}
                style={{
                    width: '70%', // Make it full width or adjust to your preference
                    height: '100px', // Adjust the height as needed
                    marginTop: '10px', // Add some space between the radio buttons and textarea
                    padding: '10px', // Add padding for better readability
                    fontSize: '14px', // Adjust the font size for better readability
                    borderRadius: '4px', // Add rounded corners if desired
                    border: '1px solid #ccc', // Add a border for a nicer look
                }}
            />
            
            
            {/*renderAlert()*/}
            <div className="buttons">{renderButton()}</div>
        </div>
    );
};

export default AnnotationPage;
