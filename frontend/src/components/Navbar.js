import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../penn_logo.png';

const navbar = () => {
    return (
        <Navbar bg="light" style={{ width: '100%' }}> 
            <Container fluid style={{ paddingLeft: 40, paddingRight: 0 }}>
                <Navbar.Brand style={{ display: 'flex', alignItems: 'center' }}>
                    <img src={logo} width="76" height="50" alt="Penn logo" />
                    <span style={{ marginLeft: "5px" }}>Evaluating Language Model Responses</span>
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
}

export default navbar;
