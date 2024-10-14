import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from './firebase-config';  // Firebase config
import { signInWithEmailAndPassword } from 'firebase/auth';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log('User signed in:', result.user);
      })
      .catch(error => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to Our App</h1>
        <p>Explore our features and enjoy a seamless experience.</p>
      </div>

      <div className="login-box" style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <h2>Login</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button onClick={emailSignIn}>Sign in</button>
        <p>
          Don't have an account? <Link to="/register">Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
