import styled, { keyframes } from 'styled-components';

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

export const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.colors.text};
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
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

export const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #218aff;
  margin-top: 150px;
  margin-bottom: 50px;
`;

export const Input = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
`;

export const Button = styled.button`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 20px 0;
  background-color: #218aff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    animation: ${glowEffect} 1.5s infinite;
  }

  &:focus {
    outline: none;
  }
`;

export const Message = styled.p`
  color: ${({ success }) => (success ? 'green' : 'red')};
  margin-top: 15px;
`;