import styled, { keyframes } from 'styled-components';

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

export const PendingRequestsContainer = styled.div`
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
  margin-bottom: 40px;
`;

export const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  background-color: #218aff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
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