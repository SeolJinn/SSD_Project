import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { 
  WavyLines,
  LandingContainer,
  ButtonGroup,
  Title,
  Subtitle,
  IconButton,
  ChatBubblesContainer,
  ChatBubble
} from '../styles/LandingPageStyles';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <LandingContainer>
      <WavyLines />
      <Title>Connect and Communicate</Title>
      <Subtitle>Experience seamless chatting, make meaningful connections, and manage your social network with ease. Log in or sign up to get started!</Subtitle>
      <ChatBubblesContainer>
        <ChatBubble isSender={false}>Hi there! Welcome to our app.</ChatBubble>
        <ChatBubble isSender={true}>Thank you! Excited to try it out.</ChatBubble>
        <ChatBubble isSender={false}>Feel free to explore and connect with others!</ChatBubble>
      </ChatBubblesContainer>
      <ButtonGroup>
        <IconButton onClick={() => navigate('/login')}>
          <FaSignInAlt /> Login
        </IconButton>
        <IconButton onClick={() => navigate('/register')}>
          <FaUserPlus /> Register
        </IconButton>
      </ButtonGroup>
    </LandingContainer>
  );
};

export default LandingPage;