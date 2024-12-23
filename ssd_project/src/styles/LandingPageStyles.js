import styled from 'styled-components';

export const LandingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 50px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  position: relative;
`;

export const Header = styled.div`
  position: absolute;
  top: 10px;  // Position very close to the top
  right: 10px;  // Position very close to the right edge
  display: flex;
  gap: 10px;
`;

export const Title = styled.h1`
  margin-top: 100px;
  font-size: 2.5rem;
`;

export const Subtitle = styled.p`
  margin-bottom: 40px;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text};
`;

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${({ theme }) => theme.colors.buttonBackground};
  color: ${({ theme }) => theme.colors.buttonText};
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent};
  }

  &:focus {
    outline: none;
  }
`;