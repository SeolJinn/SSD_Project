import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import { auth } from './firebase-config';  
import { signOut } from 'firebase/auth';    

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
    <div>
      <h2>Main Page</h2>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={() => navigate('/add-friend')}>Add a Friend</button>
      <button onClick={() => navigate('/pending-requests')}>View Pending Requests</button>
      <button onClick={() => navigate('/friends-list')}>View Friends List</button>
      {/* Other main page content */}
    </div>
  );
};

export default MainPage;
