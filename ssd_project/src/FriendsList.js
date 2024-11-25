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
  max-width: 300px;
  list-style: none;
`;

const UnfriendButton = styled.button`
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
              return { id: friendId, username: friendData.username || friendData.email };
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

      // Remove friend from the current user's friends array
      const currentUserRef = doc(db, "users", currentUser.uid);
      await updateDoc(currentUserRef, {
        friends: arrayRemove(friendId)
      });

      // Remove the current user from the friend's friends array
      const friendRef = doc(db, "users", friendId);
      await updateDoc(friendRef, {
        friends: arrayRemove(currentUser.uid)
      });

      // Update the friends list in the component state
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
              {friend.username}
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
