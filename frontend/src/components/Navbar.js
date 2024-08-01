import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../ai2.png';

const navbar = () => {
    return (
        <Navbar bg="light" style={{ width: '100%' }}> 
            <Container fluid style={{ paddingLeft: 40, paddingRight: 0 }}>
                <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} width="55" height="30" alt="AI2 logo" />
                    <span style={{ marginLeft: "10px" }}>Evaluating Language Model Responses</span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default navbar;
