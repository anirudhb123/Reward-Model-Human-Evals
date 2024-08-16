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
      relevance_1: 5,
      helpfulness_1: 4,
      depth_1: 3,
      coherence_1: 5,
      factual_correctness_1: 5,
      relevance_2: 3,
      helpfulness_2: 2,
      depth_2: 2,
      coherence_2: 3,
      factual_correctness_2: 4,
      overall_preference: "Response 1",
    },
    explanations: {
      relevance_1: "Response 1 is highly relevant as it directly addresses the query by explaining how antibiotics work against bacteria.",
      helpfulness_1: "Response 1 is helpful, providing detailed information about multiple mechanisms, though it could have been more thorough.",
      depth_1: "Response 1 provides adequate detail but could have included more depth on different types of antibiotics and their mechanisms.",
      coherence_1: "Response 1 is coherent and logically structured, making it easy to follow.",
      factual_correctness_1: "Response 1 is factually accurate and consistent.",
      relevance_2: "Response 2 is somewhat relevant, but it only briefly mentions how antibiotics work without much detail.",
      helpfulness_2: "Response 2 is less helpful as it provides only a superficial explanation.",
      depth_2: "Response 2 lacks depth as it provides only basic information.",
      coherence_2: "Response 2 is somewhat coherent but lacks a clear logical structure.",
      factual_correctness_2: "Response 2 is mostly correct but less precise in its description.",
      overall_preference: "Response 1 should be preferred as it is more complete, detailed, and relevant to the query."
    }
  },
  {
    query: "How do antibiotics work against bacteria?\n\nResponses to Follow-Up Questions:\n\nQ: What is your area of expertise?\nA: Medicine\nQ: Do you want examples of antibiotics?\nA: Yes\nQ: How long would you like the answer to be?\nA: 10 sentences\nQ: Do you need information about antibiotic resistance?\nA: Yes\nQ: Are you interested in the cellular mechanisms involved?\nA: Yes\nQ: Do you want references or sources cited?\nA: Yes",
    response1: "Antibiotics work by targeting specific features of bacterial cells. For example, penicillin interferes with the bacteria's ability to build their cell walls, which is essential for their survival, causing them to burst. Tetracycline targets the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Additionally, antibiotics like polymyxins disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Some antibiotics block the enzymes bacteria need to carry out critical functions. For instance, sulfonamides inhibit the production of folic acid, a vital nutrient for bacteria. Antibiotic resistance occurs when bacteria evolve mechanisms to withstand these drugs, such as by developing efflux pumps to expel the antibiotic. Understanding the cellular mechanisms and providing proper examples helps in addressing how antibiotics work effectively. According to recent studies, appropriate use of antibiotics can help mitigate resistance. (Smith et al., 2020)",
    response2: "Antibiotics are drugs that kill bacteria or stop their growth. For example, penicillin targets the cell wall of bacteria, making it burst. Tetracycline inhibits protein synthesis in bacteria, stopping them from multiplying. Some antibiotics, like polymyxins, disrupt the bacterial cell membrane. Additionally, sulfonamides block the production of folic acid in bacteria. Antibiotic resistance happens when bacteria change and can resist the effects of the antibiotic. It's important to use antibiotics properly to avoid resistance. References: Smith et al., 2020.",
    correctAnswers: {
      relevance_1: 5,
      helpfulness_1: 5,
      depth_1: 4,
      coherence_1: 5,
      factual_correctness_1: 5,
      relevance_2: 4,
      helpfulness_2: 4,
      depth_2: 3,
      coherence_2: 4,
      factual_correctness_2: 5,
      overall_preference: "Response 1",
    },
    explanations: {
      relevance_1: "Response 1 is highly relevant and follows the query and follow-up questions closely, providing examples and details on cellular mechanisms.",
      helpfulness_1: "Response 1 is very helpful as it includes examples, explains antibiotic resistance, and provides a reference.",
      depth_1: "Response 1 is detailed but could have included more depth or multiple references.",
      coherence_1: "Response 1 is coherent and logically structured, making it easy to follow.",
      factual_correctness_1: "Response 1 is factually accurate and consistent.",
      relevance_2: "Response 2 is relevant, but it lacks some of the details requested in the follow-up questions.",
      helpfulness_2: "Response 2 is helpful but not as thorough as Response 1.",
      depth_2: "Response 2 provides adequate detail but does not go as in-depth as Response 1.",
      coherence_2: "Response 2 is generally coherent but has minor issues with flow.",
      factual_correctness_2: "Response 2 is factually accurate and consistent.",
      overall_preference: "Response 1 should be preferred as it provides a more relevant response to the query and follow-up questions."
    }
  }
];

const TrainingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const annotatorId = location.state.annotatorId;
  const [currentExample, setCurrentExample] = useState(0);
  const [exampleAnnotation, setExampleAnnotation] = useState({
    relevance_1: 3,
    helpfulness_1: 3,
    depth_1: 3,
    coherence_1: 3,
    factual_correctness_1: 3,
    relevance_2: 3,
    helpfulness_2: 3,
    depth_2: 3,
    coherence_2: 3,
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
      relevance_1: 3,
      helpfulness_1: 3,
      depth_1: 3,
      coherence_1: 3,
      factual_correctness_1: 3,
      relevance_2: 3,
      helpfulness_2: 3,
      depth_2: 3,
      coherence_2: 3,
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
      "relevance_1",
      "helpfulness_1",
      "depth_1",
      "coherence_1",
      "factual_correctness_1",
      "relevance_2",
      "helpfulness_2",
      "depth_2",
      "coherence_2",
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
        <br />
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
            <li>Rate each response on a scale of 1 to 5 based on the following criteria:
                <br></br>
                <ul>
                    <li><b>Relevance</b>: How well does the response directly address the query and the requirements specified in the follow-up QAs (if any)? <br />
                    * Note that the response does not need to be correct or detailed simply to be relevant.</li>
                    <li><b>Helpfulness</b>: How useful do you think the user would find this response, given the query and preferences they specified in the follow-up QAs (if any)?</li>
                    <li><b>Depth</b>: How detailed and thorough is the response?</li>
                    <li><b>Factual Correctness</b>: How factually accurate is the information provided in the response?</li>
                    <li><b>Coherence</b>: How logically structured and easy to follow is the response?</li>
                </ul>
            </li><br></br>
            <li>Finally, indicate your <b>overall preference</b> for one of the two responses. If you find both responses equal in quality, you can select "Tie".</li>
            </ol>
            <br />
            Your thoughtful evaluations will help us better understand and improve the performance of AI models. Thank you for your participation!
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
          <h4> Note: In this example, pay attention to the follow-up questions and answers provided. The ideal response should meet the constraints specified in these questions and answers. </h4>
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
