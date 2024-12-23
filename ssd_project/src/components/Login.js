import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { FaArrowLeft } from 'react-icons/fa';
import {
  LoginContainer,
  WavyLines,
  BackButton,
  Title,
  WelcomeMessage,
  Input,
  Button,
  Message
} from '../styles/LoginStyles';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const navigate = useNavigate();

  const emailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log('User signed in:', result.user);
        setError('');
        navigate('/main');
      })
      .catch(error => {
        if (error.code === 'auth/invalid-credential') {
          setError('Incorrect password. Forgot your password?');
          setShowForgotPassword(true);
          setShowRegisterPrompt(false);
        } else if (error.code === 'auth/invalid-email') {
          setError('No user found with this email. Please register.');
          setShowForgotPassword(false);
          setShowRegisterPrompt(true);
        } else {
          setError('Login failed. Please try again.');
        }
      });
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent.');
      })
      .catch(error => {
        console.error('Password reset error:', error);
        alert('Error sending password reset email. Make sure you entered a valid email.');
      });
  };

  return (
    <LoginContainer>
      <WavyLines />
      <BackButton onClick={() => navigate('/')}> <FaArrowLeft /> Back </BackButton>
      <Title>Welcome Back</Title>
      <WelcomeMessage>Please log in to continue.</WelcomeMessage>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <Button onClick={emailSignIn}>Log In</Button>

      {error && <Message>{error}</Message>}

      {showForgotPassword && (
        <Message>
          Forgot password? <Button onClick={resetPassword}>Click here to reset</Button>
        </Message>
      )}

      {showRegisterPrompt && (
        <Message>
          Don\'t have an account? <Button onClick={() => navigate('/register')}>Register now</Button>
        </Message>
      )}
    </LoginContainer>
  );
};

export default Login;
