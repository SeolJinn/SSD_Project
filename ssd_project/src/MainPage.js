import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Sidebar from './Sidebar';
import ChatList from './ChatList';
import styled from 'styled-components';

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

const WelcomeMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: 1.5rem;
  margin-top: auto;
  margin-bottom: auto;
`;

const MainPage = () => {
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setMessage('Please log in to view your chats.');
          return;
        }

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        if (userData && userData.friends) {
          const friendsIds = userData.friends;

          const friendsData = await Promise.all(
            friendsIds.map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, 'users', friendId));
              const friendData = friendDoc.data();
              return { id: friendId, username: friendData.username || friendData.email };
            })
          );

          setFriends(friendsData);
        } else {
          setMessage('You have no friends yet. Start adding some!');
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setMessage('Failed to load friends.');
      }
    };

    fetchFriends();
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

  const handleChatClick = (friend) => {
    console.log('Chat clicked:', friend);
    // Logic for opening a chat window or navigating to chat can be added here
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
        {friends.length > 0 ? (
          <ChatList chats={friends} onChatClick={handleChatClick} />
        ) : (
          <WelcomeMessage>{message}</WelcomeMessage>
        )}
      </ChatArea>
    </MainPageContainer>
  );
};

export default MainPage;
