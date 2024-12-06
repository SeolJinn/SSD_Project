import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import styled from 'styled-components';
import { FaArrowLeft } from 'react-icons/fa';

const FriendsListContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 50px;
  color: ${({ theme }) => theme.colors.text};
  background-color: ${({ theme }) => theme.colors.background};
  min-height: 100vh;
  position: relative;
`;

const BackButton = styled.button`
  position: absolute;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const FriendsListItem = styled.li`
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

const FriendInfo = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  gap: 10px;
`;

const Avatar = styled.img`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background-color: ${({ theme }) => theme.colors.avatarBackground};
`;

const DefaultAvatar = styled.div`
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

const FriendName = styled.span`
  flex-grow: 1;
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnfriendButton = styled.button`
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.colors.danger};
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.dangerHover};
  }
`;

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setMessage('Please log in to view your friends list.');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();

        if (userData && userData.friends) {
          const friendsIds = userData.friends;

          const friendsData = await Promise.all(
            friendsIds.map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, "users", friendId));
              const friendData = friendDoc.data();
              return { 
                id: friendId, 
                username: friendData.username || friendData.email,
                profilePicture: friendData.profilePicture || null,
              };
            })
          );

          setFriends(friendsData);
        } else {
          setMessage('You have no friends added yet.');
        }
      } catch (error) {
        console.error('Error fetching friends list:', error);
        setMessage('Failed to load friends list.');
      }
    };

    fetchFriends();
  }, []);

  const handleUnfriend = async (friendId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMessage('Please log in to manage your friends list.');
        return;
      }

      const currentUserRef = doc(db, "users", currentUser.uid);
      await updateDoc(currentUserRef, {
        friends: arrayRemove(friendId)
      });

      const friendRef = doc(db, "users", friendId);
      await updateDoc(friendRef, {
        friends: arrayRemove(currentUser.uid)
      });

      setFriends(friends.filter(friend => friend.id !== friendId));
      setMessage('Friend removed successfully.');
    } catch (error) {
      console.error('Error unfriending:', error);
      setMessage('Failed to remove friend.');
    }
  };

  return (
    <FriendsListContainer>
      <BackButton onClick={() => navigate('/main')}>
        <FaArrowLeft /> Back
      </BackButton>
      <Title>Friends List</Title>
      {message && <p>{message}</p>}
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <FriendsListItem key={friend.id}>
              <FriendInfo>
                {friend.profilePicture ? (
                  <Avatar src={friend.profilePicture} alt={`${friend.username}'s avatar`} />
                ) : (
                  <DefaultAvatar>{friend.username.charAt(0).toUpperCase()}</DefaultAvatar>
                )}
                <FriendName>{friend.username}</FriendName>
              </FriendInfo>
              <UnfriendButton onClick={() => handleUnfriend(friend.id)}>Unfriend</UnfriendButton>
            </FriendsListItem>
          ))}
        </ul>
      ) : (
        <p>No friends to display.</p>
      )}
    </FriendsListContainer>
  );
};

export default FriendsList;
