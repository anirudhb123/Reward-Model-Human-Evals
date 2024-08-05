import { useState } from "react";
import "./pagesStyle.css";
import Example from "../components/Example";
import { Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const trainingData = [
  {
    query: "How do antibiotics work against bacteria?",
    response1: "Antibiotics work by targeting specific features of bacterial cells. For example, some antibiotics interfere with the bacteria's ability to build their cell walls, which is essential for their survival. Others target the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Some antibiotics disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Additionally, antibiotics can block the enzymes bacteria need to carry out critical functions. Each type of antibiotic has a specific mode of action, making it effective against certain types of bacteria.",
    response2: "Antibiotics are drugs that kill bacteria or stop their growth. They are used to treat bacterial infections. For example, penicillin targets the cell wall of bacteria, making it burst. Antibiotics can also stop bacteria from multiplying.",
    correctAnswers: {
      instruction_following_1: 5,
      depth_1: 3,
      coherence_1: 5,
      completeness_1: 5,
      factual_correctness_1: 5,
      instruction_following_2: 2,
      depth_2: 2,
      coherence_2: 3,
      completeness_2: 2,
      factual_correctness_2: 4,
      overall_preference: "Response 1",
    },
    explanations: {
      instruction_following_1: "Response 1 follows the instruction by explaining how antibiotics work against bacteria.",
      depth_1: "Response 1 provides sufficient information about multiple mechanisms of antibiotics, but it could use more detail about cellular mechanisms and different types of antibiotics.",
      coherence_1: "Response 1 is coherent and logically structured, making it easy to follow.",
      completeness_1: "Response 1 addresses all aspects of the query.",
      factual_correctness_1: "Response 1 is factually accurate and consistent.",
      instruction_following_2: "Response 2 does not follow the instruction well as it vaguely mentions only a few mechanisms.",
      depth_2: "Response 2 lacks depth as it provides superficial information and misses key points.",
      coherence_2: "Response 2 is somewhat coherent but lacks a logical structure.",
      completeness_2: "Response 2 fails to address most aspects of the query as it doesn't exactly explain how antibiotics function.",
      factual_correctness_2: "Response 2 contains mostly correct information but it could be more accurate about the target mechanism of penicillin.",
      overall_preference: "Response 1 should be preferred as it is more complete and detailed."
    }
  },
  {
    query: "How do antibiotics work against bacteria?\n\nResponses to Follow-Up Questions:\n\nQ: What is your area of expertise?\nA: Medicine\nQ: Do you want examples of antibiotics?\nA: Yes\nQ: How long would you like the answer to be?\nA: 10 sentences\nQ: Do you need information about antibiotic resistance?\nA: Yes\nQ: Are you interested in the cellular mechanisms involved?\nA: Yes\nQ: Do you want references or sources cited?\nA: Yes",
    response1: "Antibiotics work by targeting specific features of bacterial cells. For example, penicillin interferes with the bacteria's ability to build their cell walls, which is essential for their survival, causing them to burst. Tetracycline targets the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Additionally, antibiotics like polymyxins disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Some antibiotics block the enzymes bacteria need to carry out critical functions. For instance, sulfonamides inhibit the production of folic acid, a vital nutrient for bacteria. Antibiotic resistance occurs when bacteria evolve mechanisms to withstand these drugs, such as by developing efflux pumps to expel the antibiotic. Understanding the cellular mechanisms and providing proper examples helps in addressing how antibiotics work effectively. According to recent studies, appropriate use of antibiotics can help mitigate resistance. (Smith et al., 2020)",
    response2: "Antibiotics are drugs that kill bacteria or stop their growth. For example, penicillin targets the cell wall of bacteria, making it burst. Tetracycline inhibits protein synthesis in bacteria, stopping them from multiplying. Some antibiotics, like polymyxins, disrupt the bacterial cell membrane. Additionally, sulfonamides block the production of folic acid in bacteria. Antibiotic resistance happens when bacteria change and can resist the effects of the antibiotic. It's important to use antibiotics properly to avoid resistance. References: Smith et al., 2020.",
    correctAnswers: {
      instruction_following_1: 5,
      depth_1: 3,
      coherence_1: 5,
      completeness_1: 5,
      factual_correctness_1: 5,
      instruction_following_2: 3,
      depth_2: 4,
      coherence_2: 4,
      completeness_2: 4,
      factual_correctness_2: 5,
      overall_preference: "Response 1",
    },
    explanations: {
      instruction_following_1: "Response 1 follows the instruction by explaining how antibiotics work against bacteria in detail, including examples, cellular mechanisms, and antibiotic resistance.",
      depth_1: "Response 1 provides detailed information about multiple mechanisms of antibiotics, but only one reference is cited and the paper is not named.",
      coherence_1: "Response 1 is coherent and logically structured, making it easy to follow.",
      completeness_1: "Response 1 addresses all aspects of the query.",
      factual_correctness_1: "Response 1 is factually accurate and consistent.",
      instruction_following_2: "Response 2 follows the instruction but lacks depth that would be suitable for a medical expert. Also, it doesn't actually cite the one reference mentioned anywhere.",
      depth_2: "Response 2 provides detailed information but is not as thorough as Response 1.",
      coherence_2: "Response 2 is generally coherent but has minor issues with flow.",
      completeness_2: "Response 2 addresses most aspects of the query but with some minor gaps.",
      factual_correctness_2: "Response 2 is factually accurate and consistent.",
      overall_preference: "Response 1 should be preferred as it is more detailed and follows instructions better."
    }
  }
];

const TrainingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const annotatorId = location.state.annotatorId;
  const [currentExample, setCurrentExample] = useState(0);
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
  const [feedback, setFeedback] = useState("");
  const [validationMessage, setValidationMessage] = useState("");

  const handleCheckAnswers = () => {
    if (!validateAnnotations()) return;
    const correct = trainingData[currentExample].correctAnswers;
    const explanations = trainingData[currentExample].explanations;
    let feedbackMessage = "Feedback: ";

    Object.keys(correct).forEach(key => {
      if (exampleAnnotation[key] !== correct[key]) {
        feedbackMessage += `\n\nRating for ${key.replace(/_/g, ' ')} is incorrect. Expected: ${correct[key]}, but got: ${exampleAnnotation[key]}. ${explanations[key]}`;
      }
    });

    if (!feedbackMessage) {
      feedbackMessage = "All answers are correct!";
    }

    setFeedback(feedbackMessage);
  };

  const handleNextExample = () => {
    if (!validateAnnotations()) return;

    setFeedback("");
    setExampleAnnotation({
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
    setCurrentExample(currentExample + 1);
  };

  const handleProceedToMainTask = () => {
    if (!validateAnnotations()) return;
    navigate("/examples", { state: { data: location.state.data, annotatorId } });
  };

  const validateAnnotations = () => {
    const requiredFields = [
      "instruction_following_1",
      "depth_1",
      "coherence_1",
      "completeness_1",
      "factual_correctness_1",
      "instruction_following_2",
      "depth_2",
      "coherence_2",
      "completeness_2",
      "factual_correctness_2",
      "overall_preference"
    ];
    const missingFields = requiredFields.filter(field => exampleAnnotation[field] === "");
    console.log(missingFields);

    if (missingFields.length > 0) {
      setValidationMessage(`Please fill in all fields before proceeding. Missing fields: ${missingFields.join(", ")}`);
      return false;
    } else {
      setValidationMessage("");
      return true;
    }
  };

  return (
    <div align="center">
      <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18 }}>
        <h3> Evaluating Language Model Responses </h3>
        <br></br>
        Hello, and thank you for participating in our study! We are a group of researchers at the <a href="https://allenai.org/" target="_blank" rel="noreferrer">Allen Institute for Artificial Intelligence (Ai2)</a> building better methods for evaluating the quality of text generated by AI models like ChatGPT.
        In this task, we would like your help in <b>evaluating AI model responses to ambiguous or subjective queries</b>.
        <br></br>
        <br></br>
        Each annotation task has 2 examples:
        <ol>
          <li> <b>Example 1</b>: You will be given a <b>query</b> and <b>two AI model responses</b>. </li>
          <li> <b>Example 2</b>: You will be given the same <b>query</b> and <b>follow-up question-answer pairs that provide clarification about the query</b>, and <b>two AI model responses</b>. </li>
        </ol>
        <b>Steps in Annotation Task:</b><br></br><br></br>
        <ol>
          <li>Read the query and the two responses carefully.</li><br></br>
          <li>Rate each response on a scale of 1-5 on the following criteria:
            <br></br>
            <ul>
              <li><b>Instruction Following</b>: How well does the response follow all the instructions specified in the query as well as the follow-up questions?</li>
              <li><b>Depth</b>: How precise and thorough are the details in the response?</li>
              <li><b>Coherence</b>: How would you rate the logical flow of the response?</li>
              <li><b>Completeness</b>: How well does the response address all aspects of the query and follow-up questions?</li>
              <li><b>Factual Correctness</b>: How factually accurate and consistent is the information presented in the response?</li>
            </ul>
          </li><br></br>
          <li>Next, please provide an <b>overall preference</b> for one of the two responses. If you find both responses equally good, you can select "Tie".</li>
        </ol>
      </Alert>
      <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18 }}>
        <h2> Training Example {currentExample + 1} / 2</h2>
        <br />
        Before you begin the main annotation task, please review the following training example.
        This will help you understand how to evaluate the responses accurately.
        <br /><br />
        Please read the query and the responses carefully, and rate them based on the criteria provided.
        Once you complete this training example, you can check your answers and proceed to the main task.
        <br/>
      </Alert>
      {currentExample === 1 && (
        <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18 }}>
          <h4> Note: In this example, pay attention to the follow-up questions and answers provided. The ideal response should meet the constraints specified in the follow-up questions. </h4>
        </Alert>
      )}
      <Example
        query={trainingData[currentExample].query}
        response1={trainingData[currentExample].response1}
        response2={trainingData[currentExample].response2}
        exampleAnnotation={exampleAnnotation}
        setExampleAnnotation={setExampleAnnotation}
      />
      {feedback && (
        <Alert variant="danger" style={{ width: "70%", marginTop: "20px", textAlign: "left" }}>
        <div class="alert-danger" role="alert">
          {feedback.split('\n').map((item, index) => (
            <span key={index}>{item}<br /></span>
          ))}
        </div>
        </Alert>
      )}
      {validationMessage && (
        <Alert variant="danger" style={{ width: "70%", marginTop: "20px", textAlign: "left" }}>
        <div class="alert-danger" role="alert">
          {validationMessage.split('\n').map((item, index) => (
            <span key={index}>{item}<br /></span>
          ))}
        </div>
        </Alert>
      )}
      <div className="buttons">
        <Button
          variant="outline-primary"
          style={{ marginLeft: "20px", fontSize: "20px" }}
          onClick={handleCheckAnswers}
        >
          Check your answers
        </Button>
        {currentExample < trainingData.length - 1 ? (
          <Button
            variant="outline-primary"
            style={{ marginLeft: "20px", fontSize: "20px" }}
            onClick={handleNextExample}
          >
            Next Training Example
          </Button>
        ) : (
          <Button
            variant="outline-primary"
            style={{ marginLeft: "20px", fontSize: "20px" }}
            onClick={handleProceedToMainTask}
          >
            Proceed to Main Task
          </Button>
        )}
      </div>
    </div>
  );
};

export default TrainingPage;
