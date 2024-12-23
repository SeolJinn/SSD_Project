import styled from 'styled-components';

export const ChatListContainer = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0 auto;
  max-width: 350px;
  overflow-y: auto;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

export const ChatItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 8px 0;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverBackground};
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

export const Avatar = styled.img`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
`;

export const DefaultAvatar = styled.div`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.avatarText};
  margin-right: 15px;
`;

export const ChatDetails = styled.div`
  flex-grow: 1;
  overflow: hidden;
  text-align: left;
`;

export const ChatName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Bio = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
`;

export const LastMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
`;

export const SaveButton = styled.button`
  padding: 10px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;

export const GroupFormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

export const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const GroupPictureInput = styled.input`
  margin: 10px 0;
`;

export const FriendListContainer = styled.div`
  margin-top: 15px;
`;

export const FriendLabel = styled.label`
  display: flex;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverBackground};
  }
`;

export const StyledCheckbox = styled.input`
  appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 4px;
  margin-right: 10px;
  outline: none;
  cursor: pointer;
  background-color: ${({ theme }) => theme.colors.background};

  &:checked {
    background-color: ${({ theme }) => theme.colors.accent};
    border-color: ${({ theme }) => theme.colors.accent};
    position: relative;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 10px;
    background: white;
    border-radius: 2px;
    transform: translate(-50%, -50%);
  }
`;

export const FriendName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;