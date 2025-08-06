// app/login/page.js
// This file will be your login page for the App Router.
'use client'; // Must be a client component

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthOy'; // <--- UPDATED PATH
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation'; // Use next/navigation for App Router

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  // Function to generate a simple math CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
    setUserCaptchaInput(''); // Clear previous input
    setCaptchaError(''); // Clear previous error
    console.log('LoginPage: New CAPTCHA generated.');
  };

  // Generate CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    console.log('LoginPage: useEffect - isAuthenticated changed:', isAuthenticated);
    if (isAuthenticated) {
      console.log('LoginPage: Authenticated, redirecting to /dashboard');
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous login errors
    setCaptchaError(''); // Clear previous CAPTCHA errors
    console.log('LoginPage: Form submitted.');

    // Validate CAPTCHA first
    if (parseInt(userCaptchaInput) !== captchaAnswer) {
      setCaptchaError('Incorrect CAPTCHA. Please try again.');
      generateCaptcha(); // Generate a new CAPTCHA
      console.log('LoginPage: CAPTCHA validation failed.');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
      generateCaptcha(); // Generate a new CAPTCHA on login failure
      console.log('LoginPage: Login API call failed.');
    } else {
      console.log('LoginPage: Login API call successful.');
    }
  };

  if (isAuthenticated) {
    console.log('LoginPage: isAuthenticated is true, returning null (redirecting).');
    return null; // Or a loading spinner while redirecting
  }

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="p-4 shadow-lg rounded-3" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {captchaError && <Alert variant="warning">{captchaError}</Alert>} {/* CAPTCHA specific error */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            {/* CAPTCHA Section */}
            <Form.Group className="mb-4" controlId="formBasicCaptcha">
              <Form.Label>CAPTCHA: {captchaQuestion}</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CAPTCHA answer"
                value={userCaptchaInput}
                onChange={(e) => setUserCaptchaInput(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 rounded-pill">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;