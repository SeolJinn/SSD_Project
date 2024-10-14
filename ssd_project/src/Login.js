import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirection
import { auth } from './firebase-config'; // Firebase config
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // For error handling
  const [showForgotPassword, setShowForgotPassword] = useState(false); // For "Forgot Password" link
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false); // For "Register" prompt

  const navigate = useNavigate(); // Hook to handle redirection

  const emailSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        console.log('User signed in:', result.user);
        setError(''); // Clear any previous errors
        navigate('/main'); // Redirect to main page after successful login
      })
      .catch(error => {
        // Check specific error codes to handle login failures
        if (error.code === 'auth/invalid-credential') {
          setError('Incorrect password. Forgot your password?');
          setShowForgotPassword(true); // Show "Forgot Password" promp
          setShowRegisterPrompt(false); // Hide "Register" prompt
        } else if (error.code === 'auth/invalid-email') {
          setError('No user found with this email. Please register.');
          setShowForgotPassword(false); // Hide "Forgot Password" prompt
          setShowRegisterPrompt(true); // Show "Register" prompt
        } else {
          setError('Login failed. Please try again.');
        }
      });
  };

  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Password reset email sent.');
      })
      .catch(error => {
        console.error('Password reset error:', error);
        alert('Error sending password reset email. Make sure you entered a valid email.');
      });
  };

  return (
    <div>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {showForgotPassword && (
        <p>
          Forgot password? <button onClick={resetPassword}>Click here to reset</button>
        </p>
      )}

      {showRegisterPrompt && (
        <p>
          Don't have an account? <button onClick={() => navigate('/register')}>Register now</button>
        </p>
      )}
    </div>
  );
};

export default Login;
