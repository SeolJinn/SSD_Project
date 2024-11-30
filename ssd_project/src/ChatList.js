import React from 'react';
import styled from 'styled-components';

const ChatListContainer = styled.ul`
  list-style: none;
  padding: 10px;
  margin: 0 auto;
  max-width: 350px;
  overflow-y: auto;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: 8px;
`;

const ChatItem = styled.li`
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

const Avatar = styled.img`
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
`;

const DefaultAvatar = styled.div`
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

const ChatDetails = styled.div`
  flex-grow: 1;
  overflow: hidden;
  text-align: left;
`;

const ChatName = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const LastMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Bio = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
`;

const ChatList = ({ chats, onChatClick }) => {
  if (!chats || !Array.isArray(chats)) {
    return <p>No chats available</p>;
  }

  return (
    <ChatListContainer>
      {chats.map((chat) => {
        const name = chat?.username || 'Unknown';
        const lastMessage = chat?.lastMessage || 'No messages yet';
        const bio = chat?.bio || 'No bio available';

        return (
          <ChatItem key={chat.id} onClick={() => onChatClick(chat)}>
            {chat.profilePicture ? (
              <Avatar src={chat.profilePicture} alt={`${name}'s profile`} />
            ) : (
              <DefaultAvatar>{name.charAt(0).toUpperCase()}</DefaultAvatar>
            )}
            <ChatDetails>
              <ChatName>{name}</ChatName>
              <LastMessage>{lastMessage}</LastMessage>
              <Bio>{bio}</Bio>
            </ChatDetails>
          </ChatItem>
        );
      })}
    </ChatListContainer>
  );
};

export default ChatList;
