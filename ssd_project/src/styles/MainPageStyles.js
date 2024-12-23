import styled from 'styled-components';

export const MainPageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

export const InfoMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: auto;
  font-size: 1rem;
`;