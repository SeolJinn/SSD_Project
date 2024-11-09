import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from './firebase-config';  
import { signOut } from 'firebase/auth';    
import { FaUserPlus, FaUserClock, FaUserFriends } from 'react-icons/fa'; // Import icons
import { MdLogout } from 'react-icons/md';
import styled from 'styled-components';

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 2rem;
  cursor: pointer;
  margin: 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &:focus {
    outline: none;
  }
`;

const MainPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const MainPage = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        navigate('/');
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
  };

  return (
    <MainPageContainer>
      <h2>Main Page</h2>
      <div>
        <IconButton onClick={handleSignOut} title="Sign Out">
          <MdLogout />
        </IconButton>
        <IconButton onClick={() => navigate('/add-friend')} title="Add a Friend">
          <FaUserPlus />
        </IconButton>
        <IconButton onClick={() => navigate('/pending-requests')} title="Pending Requests">
          <FaUserClock />
        </IconButton>
        <IconButton onClick={() => navigate('/friends-list')} title="Friends List">
          <FaUserFriends />
        </IconButton>
      </div>
    </MainPageContainer>
  );
};

export default MainPage;
