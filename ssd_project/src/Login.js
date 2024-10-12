import React, { useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        // Handle successful login
        console.log(result.user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log(result.user);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <button onClick={googleSignIn}>Sign in with Google</button>
      <div>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button onClick={emailSignIn}>Sign in with Email</button>
      </div>
    </div>
  );
};

export default Login;
