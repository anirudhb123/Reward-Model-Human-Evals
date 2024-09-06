import { useState } from "react";
import "./pagesStyle.css";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [annotatorId, setAnnotatorId] = useState("");
  const [alert, setAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const baseUrl = `/api/examples/${annotatorId}`;
  const baseUrl = `/api/examples`;

  function shuffle(array) {
    let currentIndex = array.length;
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }

  const onClick = (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);  // Set submitting state to true to prevent multiple clicks
    axios
      .get(baseUrl)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          setAlert(true);
          setIsSubmitting(false);  // Re-enable the button
        } else {
          const todoExamples = response.data.filter(
            (example) => !example.completed
          );
          if (todoExamples.length === 0) {
            navigate("/submission");
          } else {
            // Get list of example IDs from todoExamples
            const exampleIds = todoExamples.map((example) => example.example_id);
            // Sample random example ID from the above list
            const randomExampleId = exampleIds[Math.floor(Math.random() * exampleIds.length)];
            // Get examples with the above ID and store in exampleList
            let exampleList = todoExamples.filter((example) => example.example_id === randomExampleId);
            // shuffle(exampleList);
            // const followUpItem = exampleList.find(example => example.query.includes("Follow-Up Questions"));
            // exampleList = exampleList.filter(example => !example.query.includes("Follow-Up Questions"));

            // // Ensure "Responses to Follow-Up Questions" item comes second if it exists
            // if (followUpItem) {
            //   exampleList.splice(1, 0, followUpItem);
            // }
            
            setIsSubmitting(false);  // Re-enable the button
            // Navigate to training page if it's the first task
            navigate("/training", { state: { data: exampleList, annotatorId: annotatorId } });
            // navigate("/examples", { state: { data: exampleList, annotatorId: annotatorId } });
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch examples:", error);
        alert("An error occurred while fetching examples. Please try again.");
        setIsSubmitting(false);  // Re-enable the button
      });
  };

  const renderAlert = () => {
    if (alert) {
      return (
        <Alert
          variant="danger"
          style={{ width: "50rem", marginTop: "20px", textAlign: "left" }}
        >
          {" "}
          No examples available at the moment{" "}
        </Alert>
      );
    }
  };

  return (
    <div align="center">
      <Card style={{ width: "50rem", marginTop: "20px" }}>
        <Card.Body>
          <Card.Title>
            {" "}
            <b>Evaluating Language Model Responses: Instructions </b>{" "}{" "}
          </Card.Title>
          <Card.Text style={{ textAlign: "left" }}>
            <p>
              {" "}
              <br></br>
              We are a group of researchers at the Allen Institute for Artificial Intelligence (Ai2) researching better evaluation practices for
              language model generations. In this task, <b>we would like you to evaluate language model responses to user queries.</b>{" "}
            </p>
            Please enter your Prolific ID below to begin:
            <Form
              style={{ marginTop: "10px", width: "400px" }}
              onSubmit={onClick}
            >
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Enter Prolific ID"
                  onChange={(text) => setAnnotatorId(text.target.value)}
                />
              </Form.Group>
            </Form>
          </Card.Text>
        </Card.Body>
      </Card>
      {renderAlert()}
      <Button
        variant="outline-primary"
        onClick={onClick}
        disabled={isSubmitting}  // Disable button while submitting
        style={{ marginTop: "20px" }}
      >
        {isSubmitting ? "Loading..." : "Submit and start study"}
      </Button>
    </div>
  );
};

export default WelcomePage;
