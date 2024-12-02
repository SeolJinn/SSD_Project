import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, storage, auth } from './firebase-config';
import { collection, addDoc, setDoc, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const Bio = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 5px;
`;

const LastMessage = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 3px;
`;

const SaveButton = styled.button`
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

const GroupFormContainer = styled.div`
  margin-top: 20px;
  padding: 20px;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
`;

const GroupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const GroupPictureInput = styled.input`
  margin: 10px 0;
`;

const FriendListContainer = styled.div`
  margin-top: 15px;
`;

const FriendLabel = styled.label`
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

const StyledCheckbox = styled.input`
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

const FriendName = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ChatList = ({ chats, onChatClick }) => {
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [groupPicture, setGroupPicture] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();

        if (userData?.friends) {
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
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    const fetchGroups = async () => {
      try {
        const currentUser = auth.currentUser;
        const q = query(
          collection(db, 'groups'),
          where('members', 'array-contains', currentUser.uid)
        );
        const querySnapshot = await getDocs(q);
        const groupData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'group',
        }));
        setGroups(groupData);
      } catch (error) {
        console.error('Error fetching groups:', error);
      }
    };

    fetchFriends();
    fetchGroups();
  }, []);


  const handleGroupSubmit = async () => {
    try {
      if (!groupName.trim()) {
        alert('Please enter a group name');
        return;
      }

      const currentUser = auth.currentUser;

      const groupRef = await addDoc(collection(db, 'groups'), {
        name: groupName,
        picture: null,
        members: [currentUser.uid, ...selectedFriends],
        createdBy: currentUser.uid,
        createdAt: new Date(),
      });

      const groupId = groupRef.id;

      let groupPictureUrl = null;
      if (groupPicture) {
        const pictureRef = ref(storage, `groupPictures/${groupId}/groupPicture.jpg`);
        const metadata = {
          customMetadata: {
            creatorId: currentUser.uid,
          },
        };
        await uploadBytes(pictureRef, groupPicture, metadata);
        groupPictureUrl = await getDownloadURL(pictureRef);

        await setDoc(groupRef, { picture: groupPictureUrl }, { merge: true });
      }

      alert('Group created successfully!');

      setShowGroupForm(false);
      setGroupName('');
      setSelectedFriends([]);
      setGroupPicture(null);
    } catch (error) {
      console.error('Error creating group:', error);
      alert('Failed to create group. Please try again.');
    }
  };

  return (
    <>
      <ChatListContainer>
            {friends.concat(groups).map((chatOrGroup) => (
              <ChatItem
                key={`${chatOrGroup.type === 'group' ? 'group-' : 'friend-'}${chatOrGroup.id}`}
                onClick={() => onChatClick(chatOrGroup)}
              >
                {chatOrGroup.profilePicture || chatOrGroup.picture ? (
                  <Avatar
                    src={chatOrGroup.profilePicture || chatOrGroup.picture}
                    alt={`${chatOrGroup.username || chatOrGroup.name}'s Avatar`}
                  />
                ) : (
                  <DefaultAvatar>
                    {chatOrGroup.username?.[0]?.toUpperCase() || chatOrGroup.name?.[0]?.toUpperCase() || 'U'}
                  </DefaultAvatar>
                )}
                <ChatDetails>
                  <ChatName>{chatOrGroup.username || chatOrGroup.name || 'Unknown'}</ChatName>
                  <Bio>
                    {chatOrGroup.bio ||
                      (chatOrGroup.type === 'group'
                        ? `${chatOrGroup.members?.length || 0} members`
                        : 'No bio available')}
                  </Bio>
                  <LastMessage>{chatOrGroup.lastMessage}</LastMessage>
                </ChatDetails>
              </ChatItem>
            ))}
            {!showGroupForm && (
              <SaveButton onClick={() => setShowGroupForm(true)}>Create Group</SaveButton>
            )}
          </ChatListContainer>
      {showGroupForm && (
        <GroupFormContainer>
          <GroupHeader>
            <h3>Create Group</h3>
            <CloseButton onClick={() => setShowGroupForm(false)}>×</CloseButton>
          </GroupHeader>
          <InputField
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <GroupPictureInput
            type="file"
            accept="image/*"
            onChange={(e) => setGroupPicture(e.target.files[0])}
          />
          <h4>Select Friends</h4>
          <FriendListContainer>
            {chats.map((chat) => (
              <FriendLabel key={chat.id}>
                <StyledCheckbox
                  type="checkbox"
                  value={chat.id}
                  checked={selectedFriends.includes(chat.id)}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setSelectedFriends((prev) =>
                      prev.includes(selectedId)
                        ? prev.filter((id) => id !== selectedId)
                        : [...prev, selectedId]
                    );
                  }}
                />
                <FriendName>{chat.username}</FriendName>
              </FriendLabel>
            ))}
          </FriendListContainer>
          <SaveButton onClick={handleGroupSubmit}>Save Group</SaveButton>
        </GroupFormContainer>
      )}
    </>
  );
};

export default ChatList;
