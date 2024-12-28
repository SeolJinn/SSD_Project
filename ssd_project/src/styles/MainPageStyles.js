import styled from 'styled-components';

export const MainPageContainer = styled.div`
  display: flex;
  height: 100vh;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1));
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.colors.text};
`;

export const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
`;

export const InfoMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: auto;
  font-size: 1rem;
`;