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
  AchievementsSection,
  AchievementTitle,
  AchievementRow,
  AchievementLabel,
  AchievementCount
} from '../styles/ProfileStyles';
import AchievementBadge from './AchievementBadge';
import { calculateLevel, getProgress, getNextThreshold } from './Achievements';

const Profile = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    bio: '',
    profilePicture: '',
    messageCount: 0,
    groupCount: 0
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
  
  const achievements = [
    {
      type: 'MESSAGES',
      label: 'Messages Sent',
      count: userData.messageCount || 0,
    },
    {
      type: 'FRIENDS',
      label: 'Friends',
      count: (userData.friends || []).length,
    },
    {
      type: 'GROUPS',
      label: 'Groups Joined',
      count: userData.groupCount || 0,
    },
  ];

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

<AchievementsSection>
 <AchievementTitle>Achievements</AchievementTitle>
 {achievements.map((achievement) => (
   <AchievementRow key={achievement.type} className="flex flex-row justify-between items-start w-full">
     <div className="flex flex-col">
       <div className="flex items-center gap-2">
         <AchievementLabel>{achievement.label}</AchievementLabel>
         <span className="text-gray-500">: {achievement.count}</span>
       </div>
       <div className="text-sm text-gray-500">
         Next Badge: {getNextThreshold(achievement.count, achievement.type) || 'Max Level!'}
       </div>
     </div>
     <AchievementBadge
       level={calculateLevel(achievement.count, achievement.type)}
       type={achievement.type}
       size="md"
     />
   </AchievementRow>
 ))}
</AchievementsSection>

      <SaveButton onClick={handleSave}>Save</SaveButton>
    </ProfileContainer>
  );
};

export default Profile;