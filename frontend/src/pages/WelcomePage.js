import { useState } from "react";
import "./pagesStyle.css";
import { useNavigate } from "react-router-dom";
import { Card, Button, Form, Alert } from "react-bootstrap";
import axios from "axios";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [annotatorId, setAnnotatorId] = useState("");
  const [alert, setAlert] = useState(false);
  // const baseUrl = `/api/examples/${annotatorId}`;
  const baseUrl = `/api/examples`;

  const onClick = (e) => {
    e.preventDefault();
    axios
      .get(baseUrl)
      .then((response) => {
        console.log(response.data);
        if (response.data.length === 0) {
          setAlert(true);
        } else {
          const todoExamples = response.data.filter(
            (example) => !example.completed
          );
          console.log(todoExamples);
          if (todoExamples.length === 0) {
            navigate("/submission");
          } else {
            // Get list of example IDs from todoExamples
            const exampleIds = todoExamples.map((example) => example.example_id);
            // Sample random example ID from the above list
            const randomExampleId = exampleIds[Math.floor(Math.random() * exampleIds.length)];
            // Get examples with the above ID and store in exampleList
            let exampleList = todoExamples.filter((example) => example.example_id === randomExampleId);
            const followUpItem = exampleList.find(example => example.query.includes("Responses to Follow-Up Questions"));
            exampleList = exampleList.filter(example => !example.query.includes("Responses to Follow-Up Questions"));

            // Ensure "Responses to Follow-Up Questions" item comes second if it exists
            if (followUpItem) {
              exampleList.splice(1, 0, followUpItem);
            }
            navigate("/examples", { state: { data: exampleList, annotatorId: annotatorId } });
          }
        }
      })
      .catch((error) => console.log(error));
  };

  const renderAlert = () => {
    if (alert) {
      return (
        <Alert
          variant="danger"
          style={{ width: "50rem", marginTop: "20px", textAlign: "left" }}
        >
          {" "}
          No examples match the provided ID in the database{" "}
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
        style={{ marginTop: "20px" }}
      >
        {" "}
        Submit and start study{" "}
      </Button>
    </div>
  );
};

export default WelcomePage;
