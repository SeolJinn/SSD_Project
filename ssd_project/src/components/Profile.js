import React, { useState, useEffect } from 'react';
import { auth, db, storage } from './firebase-config';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {
  ProfileContainer,
  Header,
  BackButton,
  Title,
  InputField,
  SaveButton,
  ProfilePictureContainer,
  ProfilePicture,
  Message,
} from '../styles/ProfileStyles';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
  });
  const [originalData, setOriginalData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setMessage('Please log in to access your profile.');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        setOriginalData(data);
      } else {
        setMessage('User data not found.');
      }
    };

    fetchUserData();
  }, []);

  const checkUniqueness = async (field, value) => {
    if (!value) return true;
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where(field, '==', value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const handleSave = async () => {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setMessage('Please log in to save your profile.');
        return;
      }

      const updates = {};
      let profilePictureUrl = originalData.profilePicture;

      if (profilePicture) {
        const pictureRef = ref(storage, `profilePictures/${currentUser.uid}`);
        await uploadBytes(pictureRef, profilePicture);
        profilePictureUrl = await getDownloadURL(pictureRef);
      }

      if (userData.username !== originalData.username) {
        const isUnique = await checkUniqueness('username', userData.username);
        if (!isUnique) {
          setMessage('Username is already in use.');
          return;
        }
        updates.username = userData.username;
      }

      if (userData.email !== originalData.email) {
        const isUnique = await checkUniqueness('email', userData.email);
        if (!isUnique) {
          setMessage('Email is already in use.');
          return;
        }
        updates.email = userData.email;
      }

      if (userData.bio !== originalData.bio) {
        updates.bio = userData.bio;
      }

      if (profilePicture && profilePictureUrl !== originalData.profilePicture) {
        updates.profilePicture = profilePictureUrl;
      }

      if (Object.keys(updates).length === 0) {
        setMessage('No changes to update.');
        return;
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updates);

      setUserData({ ...userData, ...updates });
      setOriginalData({ ...originalData, ...updates });
      setProfilePicture(null);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('Failed to update profile.');
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <ProfileContainer>
      <Header>
        <BackButton onClick={() => navigate('/main')}>
          <FaArrowLeft /> Back
        </BackButton>
        <Title>Edit Profile</Title>
      </Header>

      {message && <Message>{message}</Message>}

      <ProfilePictureContainer>
        {userData.profilePicture && (
          <ProfilePicture src={userData.profilePicture} alt="Profile" />
        )}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </ProfilePictureContainer>

      <InputField
        type="text"
        placeholder="Username"
        value={userData.username}
        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
      />
      <InputField
        type="email"
        placeholder="Email"
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <InputField
        type="text"
        placeholder="Bio"
        value={userData.bio}
        onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
      />
      <SaveButton onClick={handleSave}>Save</SaveButton>
    </ProfileContainer>
  );
};

export default Profile;
