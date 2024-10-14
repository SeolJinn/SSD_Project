import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Our App</h1>
      <p>Discover our features and get started by logging in or creating an account!</p>
      <button style={{ margin: '10px', padding: '10px 20px' }} onClick={() => navigate('/login')}>
        Login
      </button>
      <button style={{ margin: '10px', padding: '10px 20px' }} onClick={() => navigate('/register')}>
        Register
      </button>
    </div>
  );
};

export default LandingPage;
