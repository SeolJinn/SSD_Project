import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import styled from 'styled-components';
import StyledButton from './StyledButton';
import { FaArrowLeft } from 'react-icons/fa';

const RegisterContainer = styled.div`
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

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const registerUser = async () => {
    setError('');
    setSuccess(false);

    try {
      const usersRef = collection(db, "users");
      const usernameQuery = query(usersRef, where("username", "==", username));
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        setError('Username is already taken. Please choose another.');
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username,
        friends: []
      });

      console.log('User registered:', user);
      setError('');
      setSuccess(true);
    } catch (error) {
      if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters long.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Please use a different email.');
      } else {
        setError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <RegisterContainer>
      <BackButton onClick={() => navigate('/')}>
        <FaArrowLeft /> Back
      </BackButton>
      <FormContainer>
        <Title>Register</Title>
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
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <StyledButton onClick={registerUser}>Register</StyledButton>

        {error && <Message>{error}</Message>}
        {success && <Message success>Registration successful! You can now log in.</Message>}
      </FormContainer>
    </RegisterContainer>
  );
};

export default Register;
