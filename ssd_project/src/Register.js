import React, { useState } from 'react';
import { auth } from './firebase-config';  // Firebase config
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log('User registered:', result.user);
      })
      .catch(error => {
        console.error('Registration error:', error);
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
    </div>
  );
};

export default Register;
