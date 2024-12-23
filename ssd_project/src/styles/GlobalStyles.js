import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    background: linear-gradient(45deg, #1E1E1E, #2C2C2C);
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Arial', sans-serif;
  }
  button {
    font-size: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.buttonText};
    background-color: ${({ theme }) => theme.colors.buttonBackground};
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 0 15px ${({ theme }) => theme.colors.accent};
    }
  }
  input {
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.inputBackground};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 5px;
    width: 100%;
    font-size: 1rem;
  }
`;

export const theme = {
  colors: {
    background: '#1E1E1E',
    text: '#EAEAEA',
    buttonBackground: '#218AFF',
    buttonText: '#FFFFFF',
    inputBackground: '#2E2E2E',
    border: '#444',
    accent: '#218AFF'
  }
};