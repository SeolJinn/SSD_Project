import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 80px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  height: 100vh;
  position: fixed;
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  margin: 10px 0;
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;