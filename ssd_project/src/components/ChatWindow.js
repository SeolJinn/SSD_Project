import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase-config';
import { collection, addDoc, onSnapshot, query, orderBy, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { FaTimes, FaUsers } from 'react-icons/fa';
import {
  ChatWindowContainer,
  ChatHeader,
  MembersButton,
  AddMembersButton,
  CloseButton,
  MembersModal,
  MembersList,
  MemberItem,
  LeaveGroupButton,
  AddMembersModal,
  ModalTitle,
  FriendCheckbox,
  StyledCheckbox,
  AddMembersButtonSubmit,
  MessagesContainer,
  Message,
  InputContainer,
  InputField,
  SendButton,
} from '../styles/ChatWindowStyles';

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