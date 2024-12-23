import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import {
  LandingContainer,
  Header,
  Title,
  Subtitle,
  IconButton
} from '../styles/LandingPageStyles';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <Header>
        <IconButton onClick={() => navigate('/login')}>
          <FaSignInAlt /> Login
        </IconButton>
        <IconButton onClick={() => navigate('/register')}>
          <FaUserPlus /> Register
        </IconButton>
      </Header>
      <Title>Welcome to Our App</Title>
      <Subtitle>Discover our features and get started by logging in or creating an account!</Subtitle>
    </LandingContainer>
  );
};

export default LandingPage;
