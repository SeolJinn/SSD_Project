import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { auth, db } from './firebase-config';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
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

const WelcomeMessage = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  font-size: 1.5rem;
  margin-top: auto;
  margin-bottom: auto;
`;

const MainPage = () => {
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
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

              const chatId =
                currentUser.uid < friendId
                  ? `${currentUser.uid}_${friendId}`
                  : `${friendId}_${currentUser.uid}`;
              const messagesRef = collection(db, 'chats', chatId, 'messages');
              const lastMessageQuery = query(messagesRef, orderBy('timestamp', 'desc'), limit(1));
              const lastMessageSnapshot = await getDocs(lastMessageQuery);

              let lastMessage = 'No messages yet';
              if (!lastMessageSnapshot.empty) {
                lastMessage = lastMessageSnapshot.docs[0].data().text || 'No messages yet';
              }

              return {
                id: friendId,
                username: friendData.username || friendData.email,
                profilePicture: friendData.profilePicture || null,
                bio: friendData.bio || '',
                lastMessage,
              };
            })
          );

          if (friendsData.length === 0) {
            setMessage('You currently have no friends. Add some friends to start chatting!');
          }

          setFriends(friendsData);
        } else {
          setMessage('You currently have no friends. Add some friends to start chatting!');
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
    setActiveChat(friend);
  };

  const handleCloseChat = () => {
    setActiveChat(null);
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
          <ChatWindow friend={activeChat} onClose={handleCloseChat} />
        ) : friends.length > 0 ? (
          <ChatList chats={friends} onChatClick={handleChatClick} />
        ) : (
          <WelcomeMessage>{message || 'Loading your friends list...'}</WelcomeMessage>
        )}
      </ChatArea>
    </MainPageContainer>
  );
};

export default MainPage;
