import { useState } from "react";
import "./pagesStyle.css";
import Example from "../components/Example";
import { Button, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";

const trainingData = {
    pairwise: [
      {
        query: "How do antibiotics work against bacteria?",
        response1: "Antibiotics work by targeting specific features of bacterial cells. For example, some antibiotics interfere with the bacteria's ability to build their cell walls, which is essential for their survival. Others target the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Some antibiotics disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Additionally, antibiotics can block the enzymes bacteria need to carry out critical functions. Each type of antibiotic has a specific mode of action, making it effective against certain types of bacteria.",
        response2: "Antibiotics are drugs that kill bacteria or stop their growth. They are used to treat bacterial infections. For example, penicillin targets the cell wall of bacteria, making it burst. Antibiotics can also stop bacteria from multiplying.",
        correctAnswers: {
          overall_preference: "Response 1",
        },
        explanations: {
          overall_preference: "Response 1 should be preferred because it provides a more detailed and thorough explanation of how antibiotics work, covering multiple mechanisms and giving examples, which makes it more informative and useful for the user."
        },
        follow_up_qas: []
      },
      {
        query: `How do antibiotics work against bacteria?\n\nFollow-Up Questions and Answers:\n\nQ: What is your area of expertise?\nA: Medicine\nQ: Do you want examples of antibiotics?\nA: Yes\nQ: How long would you like the answer to be?\nA: 10 sentences\nQ: Do you need information about antibiotic resistance?\nA: Yes\nQ: Are you interested in the cellular mechanisms involved?\nA: Yes\nQ: Do you want references or sources cited?\nA: Yes`,
        response1: "Antibiotics work by targeting specific features of bacterial cells. For example, penicillin interferes with the bacteria's ability to build their cell walls, which is essential for their survival, causing them to burst. Tetracycline targets the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Additionally, antibiotics like polymyxins disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Some antibiotics block the enzymes bacteria need to carry out critical functions. For instance, sulfonamides inhibit the production of folic acid, a vital nutrient for bacteria. Antibiotic resistance occurs when bacteria evolve mechanisms to withstand these drugs, such as by developing efflux pumps to expel the antibiotic. Understanding the cellular mechanisms and providing proper examples helps in addressing how antibiotics work effectively. According to recent studies, appropriate use of antibiotics can help mitigate resistance. (Smith et al., 2020)",
        response2: "Antibiotics are drugs that kill bacteria or stop their growth. For example, penicillin targets the cell wall of bacteria, making it burst. Tetracycline inhibits protein synthesis in bacteria, stopping them from multiplying. Some antibiotics, like polymyxins, disrupt the bacterial cell membrane. Additionally, sulfonamides block the production of folic acid in bacteria. Antibiotic resistance happens when bacteria change and can resist the effects of the antibiotic. It's important to use antibiotics properly to avoid resistance. References: Smith et al., 2020.",
        correctAnswers: {
          overall_preference: "Response 1",
        },
        explanations: {
          overall_preference: "Response 1 should be preferred because it addresses the follow-up questions more thoroughly, including examples, a detailed explanation of cellular mechanisms, and a discussion on antibiotic resistance. It also provides a reference, making it a more complete and reliable response."
        },
        follow_up_qas: [
          {
            qa: "Q: What is your area of expertise? A: Medicine",
            satisfied_1: true,
            satisfied_2: true,
          },
          {
            qa: "Q: Do you want examples of antibiotics? A: Yes",
            satisfied_1: true,
            satisfied_2: false, // Response 2 only mentions one example, not enough to satisfy the request
          },
          {
            qa: "Q: How long would you like the answer to be? A: 10 sentences",
            satisfied_1: true,
            satisfied_2: false, // Response 2 is too short, only 6 sentences
          },
          {
            qa: "Q: Do you need information about antibiotic resistance? A: Yes",
            satisfied_1: true,
            satisfied_2: true,
          },
          {
            qa: "Q: Are you interested in the cellular mechanisms involved? A: Yes",
            satisfied_1: true,
            satisfied_2: false, // Response 2 lacks detailed discussion of cellular mechanisms
          },
          {
            qa: "Q: Do you want references or sources cited? A: Yes",
            satisfied_1: true,
            satisfied_2: true,
          },
        ]
      }
    ],
    absolute: [
      {
        query: "How do antibiotics work against bacteria?",
        response1: "Antibiotics work by targeting specific features of bacterial cells. For example, some antibiotics interfere with the bacteria's ability to build their cell walls, which is essential for their survival. Others target the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Some antibiotics disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Additionally, antibiotics can block the enzymes bacteria need to carry out critical functions. Each type of antibiotic has a specific mode of action, making it effective against certain types of bacteria.",
        response2: "Antibiotics are drugs that kill bacteria or stop their growth. They are used to treat bacterial infections. For example, penicillin targets the cell wall of bacteria, making it burst. Antibiotics can also stop bacteria from multiplying.",
        correctAnswers: {
          suitability_1: 5,
          helpfulness_1: 4,
          specificity_1: 4,
          coherence_1: 5,
          correctness_1: 5,
          suitability_2: 3,
          helpfulness_2: 3,
          specificity_2: 2,
          coherence_2: 4,
          correctness_2: 4,
        },
        explanations: {
          suitability_1: "Response 1 is highly relevant because it directly addresses the query with a detailed explanation of how antibiotics work.",
          helpfulness_1: "Response 1 is helpful as it provides multiple mechanisms by which antibiotics work, although it could include more examples.",
          specificity_1: "Response 1 offers good depth by discussing various mechanisms, though it could be even more detailed.",
          coherence_1: "Response 1 is well-organized and easy to follow.",
          correctness_1: "Response 1 is accurate, with no errors.",
          suitability_2: "Response 2 is somewhat relevant but lacks detail and depth.",
          helpfulness_2: "Response 2 is less helpful because it provides only basic information.",
          specificity_2: "Response 2 lacks details, offering a very general overview.",
          coherence_2: "Response 2 is coherent but lacks the detailed structure of Response 1.",
          correctness_2: "Response 2 is correct, but it is less precise than Response 1."
        },
        follow_up_qas: []
      },
      {
        query: `How do antibiotics work against bacteria?\n\nFollow-Up Questions and Answers:\n\nQ: What is your area of expertise?\nA: Medicine\nQ: Do you want examples of antibiotics?\nA: Yes\nQ: How long would you like the answer to be?\nA: 10 sentences\nQ: Do you need information about antibiotic resistance?\nA: Yes\nQ: Are you interested in the cellular mechanisms involved?\nA: Yes\nQ: Do you want references or sources cited?\nA: Yes`,
        response1: "Antibiotics work by targeting specific features of bacterial cells. For example, penicillin interferes with the bacteria's ability to build their cell walls, which is essential for their survival, causing them to burst. Tetracycline targets the protein-making machinery of bacteria, thereby inhibiting their growth and reproduction. Additionally, antibiotics like polymyxins disrupt the bacterial cell membrane, causing the contents to leak out, leading to cell death. Some antibiotics block the enzymes bacteria need to carry out critical functions. For instance, sulfonamides inhibit the production of folic acid, a vital nutrient for bacteria. Antibiotic resistance occurs when bacteria evolve mechanisms to withstand these drugs, such as by developing efflux pumps to expel the antibiotic. Understanding the cellular mechanisms and providing proper examples helps in addressing how antibiotics work effectively. According to recent studies, appropriate use of antibiotics can help mitigate resistance. (Smith et al., 2020)",
        response2: "Antibiotics are drugs that kill bacteria or stop their growth. For example, penicillin targets the cell wall of bacteria, making it burst. Tetracycline inhibits protein synthesis in bacteria, stopping them from multiplying. Some antibiotics, like polymyxins, disrupt the bacterial cell membrane. Additionally, sulfonamides block the production of folic acid in bacteria. Antibiotic resistance happens when bacteria change and can resist the effects of the antibiotic. It's important to use antibiotics properly to avoid resistance. References: Smith et al., 2020.",
        correctAnswers: {
          suitability_1: 5,
          helpfulness_1: 5,
          specificity_1: 4,
          coherence_1: 5,
          correctness_1: 5,
          suitability_2: 4,
          helpfulness_2: 4,
          specificity_2: 3,
          coherence_2: 4,
          correctness_2: 5,
        },
        explanations: {
          suitability_1: "Response 1 is highly relevant and follows the query and follow-up questions closely, providing examples and details on cellular mechanisms.",
          helpfulness_1: "Response 1 is very helpful as it includes examples, explains antibiotic resistance, and provides a reference.",
          specificity_1: "Response 1 is detailed but could have included more details or multiple references.",
          coherence_1: "Response 1 is coherent and logically structured, making it easy to follow.",
          correctness_1: "Response 1 is accurate and consistent.",
          suitability_2: "Response 2 is relevant, but it lacks some of the details requested in the follow-up questions.",
          helpfulness_2: "Response 2 is helpful but not as thorough as Response 1.",
          specificity_2: "Response 2 provides adequate detail but does not go as in-depth as Response 1.",
          coherence_2: "Response 2 is generally coherent but has minor issues with flow.",
          correctness_2: "Response 2 is accurate and consistent."
        },
        follow_up_qas: [
          {
            qa: "Q: What is your area of expertise? A: Medicine",
            satisfied_1: true,
            satisfied_2: true,
          },
          {
            qa: "Q: Do you want examples of antibiotics? A: Yes",
            satisfied_1: true,
            satisfied_2: false, // Response 2 only provides one example and lacks variety
          },
          {
            qa: "Q: How long would you like the answer to be? A: 10 sentences",
            satisfied_1: true,
            satisfied_2: false, // Response 2 is too brief, only 6 sentences
          },
          {
            qa: "Q: Do you need information about antibiotic resistance? A: Yes",
            satisfied_1: true,
            satisfied_2: true,
          },
          {
            qa: "Q: Are you interested in the cellular mechanisms involved? A: Yes",
            satisfied_1: true,
            satisfied_2: false, // Response 2 does not provide sufficient detail on cellular mechanisms
          },
          {
            qa: "Q: Do you want references or sources cited? A: Yes",
            satisfied_1: true,
            satisfied_2: true,
          },
        ]
      }
    ]
  };


const TrainingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state.data[0].mode; // Assuming the mode is passed via location state
  const annotatorId = location.state.annotatorId;
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
  const [feedback, setFeedback] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const trainingExamples = trainingData[mode];


  const handleCheckAnswers = () => {
    if (!validateAnnotations()) return;

    const correct = trainingExamples[currentExample].correctAnswers;
    const explanations = trainingExamples[currentExample].explanations;
    let feedbackMessage = "Feedback: ";

    // Check the main ratings
    Object.keys(correct).forEach((key) => {
      if (exampleAnnotation[key] !== correct[key]) {
        feedbackMessage += `\n\nRating for ${key.replace(
          /_/g,
          " "
        )} is incorrect. Expected: ${correct[key]}, but got: ${
          exampleAnnotation[key]
        }. ${explanations[key]}`;
      }
    });

    // Check the follow-up QA ratings
    // if (trainingExamples[currentExample].follow_up_qas && currentExample === 1) {
    //   console.log(exampleAnnotation);
    //   console.log(trainingExamples[currentExample].follow_up_qas);
    //   trainingExamples[currentExample].follow_up_qas.forEach((qa, index) => {   
    //     const satisfied_1_key = `satisfied_1`;
    //     const satisfied_2_key = `satisfied_2`;

    //     if (
    //       exampleAnnotation.follow_up_qas[index][satisfied_1_key] !== qa.satisfied_1 &&
    //       qa.satisfied_1 !== undefined
    //     ) {
    //       feedbackMessage += `\n\nFollow-up QA ${index + 1} for Response 1 is incorrect. Expected: ${qa.satisfied_1}, but got: ${exampleAnnotation.follow_up_qas[index][satisfied_1_key]}.`;
    //     }

    //     if (
    //       exampleAnnotation.follow_up_qas[index][satisfied_2_key] !== qa.satisfied_2 &&
    //       qa.satisfied_2 !== undefined
    //     ) {
    //       feedbackMessage += `\n\nFollow-up QA ${index + 1} for Response 2 is incorrect. Expected: ${qa.satisfied_2}, but got: ${exampleAnnotation.follow_up_qas[index][satisfied_2_key]}.`;
    //     }
    //   });
    // }

    if (feedbackMessage === "Feedback: ") {
      feedbackMessage = "All answers are correct!";
    }

    setFeedback(feedbackMessage);
  };

  const handleNextExample = () => {
    if (!validateAnnotations()) return;
    setFeedback("");
    setExampleAnnotation(emptyExample);
    setCurrentExample(currentExample + 1);
  };

  const handleProceedToMainTask = () => {
    if (!validateAnnotations()) return;
    navigate("/examples", { state: { data: location.state.data, annotatorId } });
  };

  const validateAnnotations = () => {
    let requiredFields = [];
    if (mode === 'pairwise') {
        requiredFields = ["overall_preference"];
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
        ];
    }
    const missingFields = requiredFields.filter(field => exampleAnnotation[field] === "" || exampleAnnotation[field] === null);
    if (currentExample === 1) {
        // TODO: Add validation for follow-up QAs
        // Validation for follow-up QAs
        trainingExamples[currentExample].follow_up_qas.forEach((qa, index) => {
        if (qa.satisfied_1 === "" || qa.satisfied_1 === null) {
            missingFields.push(`Follow-up QA ${index + 1} (Response 1)`);
        }
        if (qa.satisfied_2 === "" || qa.satisfied_2 === null) {
            missingFields.push(`Follow-up QA ${index + 1} (Response 2)`);
        }
        });
    }

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
      <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18, backgroundColor: 'white' }}>
        <h3> Evaluating Language Model Responses (Training Task)</h3>
        <br></br>
        Hello, and thank you for participating in our study! We are a group of researchers at the <a href="https://allenai.org/" target="_blank" rel="noreferrer">Allen Institute for Artificial Intelligence (Ai2)</a>, working on developing better methods for evaluating the quality of text generated by AI models like ChatGPT.
        <br></br>
        <br></br>
        <b>Task Overview:</b><br></br><br></br>
        In this task, we ask you to evaluate AI model responses to queries that may be ambiguous or subjective in nature. 
        Imagine that these queries were posed by a real person X (such as a coworker or a friend), seeking information from an AI model. Your role is to assess how well the AI model's responses address these queries.<br /><br />
        Since the queries can be ambiguous or subjective, we asked follow-up questions to the person X about their query. These questions can be about the person's intent, background or preferences. Your evaluation should consider these follow-up questions and the person X's answers to them. For instance, a query might be <i>"What is the best way to cook pasta?"</i>, where the follow-up question might be <i>"Q: Would you like a step-by-step recipe or a general overview?"</i> and the person's answer might be <i>"A: Step-by-step recipe"</i>. In this case, a step-by-step recipe would be preferred in the response.<br /><br />
        Each annotation task includes 3 examples of the following two types:
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
      </Alert>
      <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18, backgroundColor: 'white' }}>
        <h2> Training Example {currentExample + 1} / 2</h2>
        <br />
        Before you begin the main annotation task, please review the following training example.
        This will help you understand how to evaluate the responses accurately.
        <br /><br />
        Please read the query and the responses carefully.
        Once you complete this training example, you can check your answers and proceed to the main task.
        <br/>
      </Alert>
      {currentExample === 1 && (
        <Alert style={{ width: "70%", marginTop: "20px", textAlign: "left", fontSize: 18 }}>
          <h4> Note: In this example, pay attention to the follow-up questions and answers provided. The ideal response should meet the constraints specified in these questions and answers. For example, if the person said they are a medical expert, then the ideal response should be technical and not overly simplified.</h4>
        </Alert>
      )}
      <Example
        query={trainingExamples[currentExample].query}
        response1={trainingExamples[currentExample].response1}
        response2={trainingExamples[currentExample].response2}
        exampleAnnotation={exampleAnnotation}
        setExampleAnnotation={setExampleAnnotation}
        mode={mode}
        follow_up_qas={trainingExamples[currentExample].follow_up_qas}
        currentExample={currentExample}
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
        {currentExample < trainingExamples.length - 1 ? (
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
