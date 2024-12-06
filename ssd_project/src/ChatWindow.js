import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db, auth } from './firebase-config';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaTimes, FaUsers } from 'react-icons/fa';

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
  position: relative;
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

const MembersButton = styled.button`
  position: absolute;
  right: 50px; /* Move it closer to the left side of the header */
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const MembersModal = styled.div`
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

const MembersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
`;

const MemberItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: ${({ theme }) => theme.colors.text};
`;

const LeaveGroupButton = styled.button`
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
  border-radius: ${({ ismine }) => (ismine ? '15px 15px 0 15px' : '15px 15px 15px 0')};
  align-self: ${({ ismine }) => (ismine ? 'flex-end' : 'flex-start')};
  max-width: 70%;
  min-width: 50px;
  width: fit-content;
  background-color: ${({ isMine }) => (isMine ? '#218AFF' : '#808080')};
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

const AddMembersButton = styled.button`
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

const AddMembersModal = styled.div`
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

const ModalTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 15px;
`;

const FriendCheckbox = styled.label`
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

const StyledCheckbox = styled.input`
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

const AddMembersButtonSubmit = styled.button`
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

const ChatWindow = ({ chat, onClose, isGroup }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [showAddMembers, setShowAddMembers] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    const chatId = isGroup
      ? chat.id
      : auth.currentUser.uid < chat.id
      ? `${auth.currentUser.uid}_${chat.id}`
      : `${chat.id}_${auth.currentUser.uid}`;
    const messagesRef = collection(db, isGroup ? `groups/${chatId}/messages` : `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    if (isGroup) {
      const fetchMembers = async () => {
        const groupDoc = await getDoc(doc(db, 'groups', chat.id));
        const groupData = groupDoc.data();
        const memberData = await Promise.all(
          groupData.members.map(async (memberId) => {
            const userDoc = await getDoc(doc(db, 'users', memberId));
            return {
              id: memberId,
              username: userDoc.data()?.username || 'Unknown',
            };
          })
        );
        setMembers(memberData);

        const currentUser = auth.currentUser;
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userFriends = userDoc.data().friends || [];
        const nonMembers = await Promise.all(
          userFriends
            .filter((friendId) => !groupData.members.includes(friendId))
            .map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, 'users', friendId));
              return {
                id: friendId,
                username: friendDoc.data()?.username || 'Unknown',
              };
            })
        );
        setFriends(nonMembers);
      };

      fetchMembers();
    }

    return () => unsubscribe();
  }, [chat, isGroup]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const chatId = isGroup
      ? chat.id
      : auth.currentUser.uid < chat.id
      ? `${auth.currentUser.uid}_${chat.id}`
      : `${chat.id}_${auth.currentUser.uid}`;
    const messagesRef = collection(db, isGroup ? `groups/${chatId}/messages` : `chats/${chatId}/messages`);

    const currentUser = auth.currentUser;
    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
    const senderName = userDoc.exists() ? userDoc.data().username || 'Unknown' : 'Unknown';

    await addDoc(messagesRef, {
      text: newMessage,
      senderId: currentUser.uid,
      senderName: senderName,
      timestamp: new Date(),
    });

    setNewMessage('');
  };

  const leaveGroup = async () => {
    try {
      const currentUser = auth.currentUser;
      const groupRef = doc(db, 'groups', chat.id);

      await updateDoc(groupRef, {
        members: arrayRemove(currentUser.uid),
      });

      alert('You have left the group.');
      onClose();
    } catch (error) {
      console.error('Error leaving group:', error);
      alert('Failed to leave the group.');
    }
  };

  const addMembersToGroup = async () => {
    try {
      const groupRef = doc(db, 'groups', chat.id);

      const newMembers = selectedFriends.map((friend) => friend.id);
      await updateDoc(groupRef, {
        members: arrayUnion(...newMembers),
      });

      alert('Members added successfully!');
      setShowAddMembers(false);
      setSelectedFriends([]);
    } catch (error) {
      console.error('Error adding members:', error);
      alert('Failed to add members.');
    }
  };

  const toggleFriendSelection = (friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.id === friend.id)
        ? prev.filter((f) => f.id !== friend.id)
        : [...prev, friend]
    );
  };

  return (
    <ChatWindowContainer>
      <ChatHeader>
        <span>{isGroup ? `Group: ${chat.name}` : `Chat with ${chat.username}`}</span>
        {isGroup && (
          <>
            <MembersButton onClick={() => setShowMembers((prev) => !prev)}>
              <FaUsers />
            </MembersButton>
            <AddMembersButton onClick={() => setShowAddMembers((prev) => !prev)}>
              + Add
            </AddMembersButton>
          </>
        )}
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
      </ChatHeader>
      {showMembers && isGroup && (
        <MembersModal>
          <h4>Group Members</h4>
          <MembersList>
            {members.map((member) => (
              <MemberItem key={member.id}>{member.username}</MemberItem>
            ))}
          </MembersList>
          <LeaveGroupButton onClick={leaveGroup}>Leave Group</LeaveGroupButton>
        </MembersModal>
      )}
      {showAddMembers && isGroup && (
        <AddMembersModal>
          <ModalTitle>Add Friends to Group</ModalTitle>
          {friends.map((friend) => (
            <FriendCheckbox key={friend.id}>
              <span>{friend.username}</span>
              <StyledCheckbox
                type="checkbox"
                onChange={() => toggleFriendSelection(friend)}
                checked={selectedFriends.some((f) => f.id === friend.id)}
              />
            </FriendCheckbox>
          ))}
          <AddMembersButtonSubmit onClick={addMembersToGroup}>
            Add Members
          </AddMembersButtonSubmit>
        </AddMembersModal>
      )}
      <MessagesContainer>
        {messages.map((message) => (
          <Message key={message.id} isMine={message.senderId === auth.currentUser.uid}>
            {isGroup && !message.isMine && <strong>{message.senderName}: </strong>}
            {message.text}
          </Message>
        ))}
      </MessagesContainer>
      <InputContainer>
        <InputField
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton onClick={sendMessage}>Send</SendButton>
      </InputContainer>
    </ChatWindowContainer>
  );
};

export default ChatWindow;