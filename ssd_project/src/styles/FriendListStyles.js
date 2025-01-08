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

export const FriendsListContainer = styled.div`
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

export const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  color: #218aff;
  margin-bottom: 40px;
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
  margin-right: 20px;
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
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.danger};
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: box-shadow 0.3s ease;

  &:hover {
    animation: ${glowEffect} 1.5s infinite;
  }
`;

export const Message = styled.p`
  color: ${({ success }) => (success ? 'green' : 'red')};
  margin-top: 15px;
`;

export const AchievementContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-right: 16px;
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.accent};
  cursor: pointer;
  padding: 4px;
  
  &:hover {
    opacity: 0.8;
  }
`;