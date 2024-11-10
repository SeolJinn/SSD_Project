import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';
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
            <li key={friend.id}>{friend.username}</li>
          ))}
        </ul>
      ) : (
        <p>No friends to display.</p>
      )}
    </FriendsListContainer>
  );
};

export default FriendsList;
