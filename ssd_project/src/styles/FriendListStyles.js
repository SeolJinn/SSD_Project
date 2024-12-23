import styled from 'styled-components';

export const FriendsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  position: relative;
`;

export const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.buttonText};
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
  margin-bottom: 20px;
`;

export const FriendsListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
  padding: 10px;
  list-style: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${({ theme }) => theme.colors.hoverBackground};
  }
`;

export const FriendInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
`;

export const Avatar = styled.img`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
`;

export const DefaultAvatar = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.avatarText};
`;

export const FriendName = styled.span`
  flex-grow: 1;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const UnfriendButton = styled.button`
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.danger};
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;