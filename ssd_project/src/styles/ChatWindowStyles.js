import styled from 'styled-components';

export const ChatWindowContainer = styled.div`
 display: flex;
 flex-direction: column;
 height: calc(100vh - 40px);
 min-height: 400px;
 margin-left: 50px;
`;

export const ChatHeader = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const MembersButton = styled.button`
  position: absolute;
  right: 50px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const MembersModal = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 10px;
  z-index: 100;
  max-width: 300px;
`;

export const MembersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

export const MemberItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.text};
`;

export const LeaveGroupButton = styled.button`
  background-color: ${({ theme }) => theme.colors.danger};
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Message = styled.div`
  margin: 5px 0;
  padding: 10px 15px;
  border-radius: ${({ isMine }) => (isMine ? '15px 15px 0 15px' : '15px 15px 15px 0')};
  align-self: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  min-width: 50px;
  width: fit-content;
  background-color: ${({ isMine }) => (isMine ? '#218AFF' : '#808080')};
  color: #fff;
  margin-right: ${({ isMine }) => (isMine ? '10px' : 'auto')};
  margin-left: ${({ isMine }) => (isMine ? 'auto' : '10px')};
  word-wrap: break-word;
`;

export const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

export const InputField = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const SendButton = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;

export const AddMembersButton = styled.button`
  position: absolute;
  right: 110px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const AddMembersModal = styled.div`
  position: absolute;
  top: 50px;
  right: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  z-index: 100;
  max-width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const ModalTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 15px;
`;

export const FriendCheckbox = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverBackground};
  }

  span {
    flex-grow: 1;
    color: ${({ theme }) => theme.colors.text};
    font-size: 1rem;
  }
`;

export const StyledCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  position: relative;

  &:checked {
    background-color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
  }

  &:checked::after {
    content: '✔';
    font-size: 14px;
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const AddMembersButtonSubmit = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;