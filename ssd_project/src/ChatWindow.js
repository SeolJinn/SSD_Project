import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, auth } from './firebase-config';
import { doc, collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FaTimes } from 'react-icons/fa';

const ChatWindowContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  position: relative;
  margin-left: 50px;
`;

const ChatHeader = styled.div`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  margin-bottom: 10px;
`;

const Message = styled.div`
  margin: 5px 0;
  padding: 10px 15px;
  border-radius: ${({ isMine }) =>
    isMine ? '15px 15px 0 15px' : '15px 15px 15px 0'};
  align-self: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  min-width: 50px;
  width: fit-content;
  background-color: ${({ isMine }) =>
    isMine ? '#218AFF' : '#808080'};
  color: #fff;

  margin-right: ${({ isMine }) => (isMine ? '10px' : 'auto')};
  margin-left: ${({ isMine }) => (isMine ? 'auto' : '10px')};
  word-wrap: break-word;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const InputField = styled.input`
  flex-grow: 1;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SendButton = styled.button`
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

const ChatWindow = ({ friend, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const chatId =
      auth.currentUser.uid < friend.id
        ? `${auth.currentUser.uid}_${friend.id}`
        : `${friend.id}_${auth.currentUser.uid}`;
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [friend]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const chatId =
      auth.currentUser.uid < friend.id
        ? `${auth.currentUser.uid}_${friend.id}`
        : `${friend.id}_${auth.currentUser.uid}`;
    const messagesRef = collection(db, 'chats', chatId, 'messages');

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: auth.currentUser.uid,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <span>Chat with {friend.username}</span>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </ChatHeader>
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isMine={message.senderId === auth.currentUser.uid}>
            {message.text}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <InputField
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;
