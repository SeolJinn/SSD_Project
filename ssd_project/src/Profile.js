import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from './firebase-config';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.2rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const InputField = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.colors.accent};
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accentHover};
  }
`;

const ProfilePictureContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfilePicture = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid ${({ theme }) => theme.colors.accent};
`;

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
          <FaArrowLeft />
        </BackButton>
        <Title>Edit Profile</Title>
      </Header>

      {message && <p>{message}</p>}

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
