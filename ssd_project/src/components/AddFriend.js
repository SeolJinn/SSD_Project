import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { 
  AddFriendContainer, 
  BackButton, 
  Title, 
  InputField, 
  Message 
} from '../styles/AddFriendStyles';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import StyledButton from '../styles/StyledButton';
import { FaArrowLeft } from 'react-icons/fa';

const AddFriend = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAddFriend = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMessage('Please log in to add friends.');
        return;
      }

      if (email === currentUser.email) {
        setMessage("You can't send a friend request to yourself.");
        return;
      }

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setMessage('No user found with that email.');
        return;
      }

      const targetUser = querySnapshot.docs[0];
      const targetUserId = targetUser.id;

      const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
      const currentUserData = currentUserDoc.data();

      if (currentUserData && currentUserData.friends && currentUserData.friends.includes(targetUserId)) {
        setMessage('This user is already your friend.');
        return;
      }

      const friendRequestsRef = collection(db, "friendRequests");
      const existingRequestQuery = query(
        friendRequestsRef,
        where("fromUserId", "==", currentUser.uid),
        where("toUserId", "==", targetUserId),
        where("status", "==", "pending")
      );
      const existingRequestSnapshot = await getDocs(existingRequestQuery);

      if (!existingRequestSnapshot.empty) {
        setMessage('You already have a pending friend request to this user.');
        return;
      }

      await addDoc(friendRequestsRef, {
        fromUserId: currentUser.uid,
        toUserId: targetUserId,
        status: "pending"
      });

      setMessage('Friend request sent!');
    } catch (error) {
      console.error('Error adding friend:', error);
      setMessage('Error sending friend request. Please try again.');
    }
  };

  return (
    <AddFriendContainer>
      <BackButton onClick={() => navigate('/main')}>
        <FaArrowLeft /> Back
      </BackButton>
      <Title>Add Friend</Title>
      <InputField
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Friend's email"
      />
      <StyledButton onClick={handleAddFriend}>Add Friend</StyledButton>
      {message && <Message>{message}</Message>}
    </AddFriendContainer>
  );
};

export default AddFriend;
