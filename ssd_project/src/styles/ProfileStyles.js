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

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 50px;
  color: ${({ theme }) => theme.colors.text};
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  min-height: 100vh;
  position: relative;
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
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

export const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  flex-grow: 1;
`;

export const InputField = styled.input`
  width: 100%;
  max-width: 400px;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.inputBackground};
  color: ${({ theme }) => theme.colors.text};
`;

export const SaveButton = styled.button`
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

export const ProfilePictureContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid ${({ theme }) => theme.colors.accent};
`;

export const Message = styled.p`
  color: ${({ success }) => (success ? 'green' : 'red')};
  margin-top: 15px;
`;