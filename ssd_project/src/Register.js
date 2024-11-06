import React, { useState } from 'react';
import { auth } from './firebase-config';  
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  

  const registerUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log('User registered:', result.user);
        setError('');  
      })
      .catch(error => {
        if (error.code === 'auth/weak-password') {
          setError('Password should be at least 6 characters long.');
        } else if (error.code === 'auth/email-already-in-use') {
          setError('This email is already in use. Please use a different email.');
        } else {
          setError('Registration failed. Please try again.');
        }
      });
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={registerUser}>Register</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Show error messages */}
    </div>
  );
};

export default Register;
