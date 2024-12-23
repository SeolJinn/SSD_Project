import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const waveAnimation = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
`;

export const glowEffect = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0);
  }
  50% {
    box-shadow: 0 0 15px rgba(33, 138, 255, 0.5);
  }
  100% {
    box-shadow: 0 0 5px rgba(0, 0, 0, 0);
  }
`;

export const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 50px;
  color: ${({ theme }) => theme.colors.text};
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

export const WavyLines = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.1) 0px,
    rgba(255, 255, 255, 0.1) 5px,
    transparent 5px,
    transparent 10px
  );
  background-size: 100% 20px;
  mask-image: radial-gradient(circle, transparent 40%, black 100%);
  animation: ${waveAnimation} 6s linear infinite;
  pointer-events: none;
`;

export const Header = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

export const Title = styled.h1`
  margin-top: 100px;
  font-size: 3.5rem;
  font-weight: bold;
  color: #218aff;
  animation: ${fadeIn} 1s ease-out;
`;

export const Subtitle = styled.p`
  margin: 20px 0 40px;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  animation: ${fadeIn} 1.5s ease-out;
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: #218aff;
  color: #fff;
  border: none;
  padding: 15px 30px;
  font-size: 1.3rem;
  cursor: pointer;
  border-radius: 5px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    animation: ${glowEffect} 1.5s infinite;
  }

  &:focus {
    outline: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 40px;
  margin-top: 20px;
  animation: ${fadeIn} 2s ease-out;
`;

export const ChatBubblesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 100px;
  width: 80%;
  max-width: 400px;
  animation: ${fadeIn} 2s ease-out;
`;

export const ChatBubble = styled.div`
  background-color: ${({ isSender }) => (isSender ? '#218aff' : '#e0e0e0')};
  color: ${({ isSender }) => (isSender ? '#fff' : '#000')};
  padding: 10px 15px;
  border-radius: ${({ isSender }) => (isSender ? '15px 15px 0 15px' : '15px 15px 15px 0')};
  align-self: ${({ isSender }) => (isSender ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  word-wrap: break-word;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;