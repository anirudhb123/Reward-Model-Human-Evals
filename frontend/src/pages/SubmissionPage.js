import {Card} from 'react-bootstrap';

const SubmissionPage = () => {
    return (
        <div align="center"> 
            <Card style={{ width: '80%', marginTop: '20px'}}>
                <Card.Body>
                    <Card.Title> You have submitted all examples and finished the study! </Card.Title>
                    <Card.Text>
                        <br/>
                        <p> Thank you for participating in this study. </p>
                        <p> Your completion code is: </p>
                        <h2> C1CJQT0C </h2>
                    </Card.Text>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SubmissionPage