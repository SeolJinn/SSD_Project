import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import StyledButton from '../styles/StyledButton';
import { FaArrowLeft } from 'react-icons/fa';
import {
  RegisterContainer,
  FormContainer,
  BackButton,
  Title,
  Input,
  Message
} from '../styles/RegisterStyles';

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
