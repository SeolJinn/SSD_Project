import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Sidebar from './Sidebar';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const MainPageContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const InfoMessage = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: auto;
  font-size: 1rem;
`;

const MainPage = () => {
  const [friends, setFriends] = useState([]);
  const [groups] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setMessage('Please log in to view your chats.');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        if (userData && userData.friends) {
          const friendsData = await Promise.all(
            userData.friends.map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, 'users', friendId));
              const friendData = friendDoc.data();

              return {
                id: friendId,
                username: friendData.username || friendData.email,
                profilePicture: friendData.profilePicture || null,
                bio: friendData.bio || '',
              };
            })
          );

          setFriends(friendsData);
        } else {
          setMessage('You currently have no friends. Add some friends to start chatting!');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        setMessage('Failed to load chats.');
      }
    };

    fetchChats();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign out error:', error);
      });
  };

  const handleChatClick = (chat, isGroup) => {
    setActiveChat(chat);
    setIsGroupChat(isGroup);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
    setIsGroupChat(false);
  };

  return (
    <MainPageContainer>
      {/* Sidebar for navigation */}
      <Sidebar
        onNavigate={(path) => {
          if (path === '/logout') handleSignOut();
          else navigate(path);
        }}
      />

      {/* Main Chat Area */}
      <ChatArea>
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            onClose={handleCloseChat}
            isGroup={isGroupChat}
          />
        ) : (
          <>
            {message && <InfoMessage>{message}</InfoMessage>}
            <ChatList
              chats={[...friends, ...groups]}
              onChatClick={(chat) => handleChatClick(chat, !!chat.members)}
            />
          </>
        )}
      </ChatArea>
    </MainPageContainer>
  );
};

export default MainPage;
