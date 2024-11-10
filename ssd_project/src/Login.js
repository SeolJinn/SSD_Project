import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import styled from 'styled-components';
import StyledButton from './StyledButton';
import { FaArrowLeft } from 'react-icons/fa';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  position: relative;
`;

const FormContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 300px;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
`;

const Message = styled.p`
  color: ${({ success }) => (success ? 'green' : 'red')};
  margin-top: 15px;
`;

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
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back
      </BackButton>
      <FormContainer>
        <Title>Login</Title>
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
        <StyledButton onClick={emailSignIn}>Sign in</StyledButton>

        {error && <Message>{error}</Message>}

        {showForgotPassword && (
          <Message>
            Forgot password? <StyledButton onClick={resetPassword}>Click here to reset</StyledButton>
          </Message>
        )}

        {showRegisterPrompt && (
          <Message>
            Don't have an account? <StyledButton onClick={() => navigate('/register')}>Register now</StyledButton>
          </Message>
        )}
      </FormContainer>
    </LoginContainer>
  );
};

export default Login;
