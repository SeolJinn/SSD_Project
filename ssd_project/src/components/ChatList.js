import React, { useEffect, useState } from 'react';
import { 
  ChatListContainer, 
  ChatItem, 
  Avatar, 
  DefaultAvatar, 
  ChatDetails, 
  ChatName, 
  Bio, 
  SaveButton,
  CloseButton,
  GroupFormContainer,
  LastMessage,
  GroupHeader,
  InputField,
  GroupPictureInput,
  FriendListContainer,
  FriendLabel,
  StyledCheckbox,
  FriendName
} from '../styles/ChatListStyles';
import { db, storage, auth } from './firebase-config';
import { collection, addDoc, setDoc, query, where, getDocs, doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
      const updates = [currentUser.uid, ...selectedFriends].map(userId => 
        updateDoc(doc(db, 'users', userId), {
          groupCount: increment(1)
        })
      );
      await Promise.all(updates);  

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
