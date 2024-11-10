import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './GlobalStyles';
import LandingPage from './LandingPage';
import Login from './Login';
import MainPage from './MainPage';
import Register from './Register';
import AddFriend from './AddFriend';
import PendingRequests from './PendingRequests';
import FriendsList from './FriendsList';
import ProtectedRoute from './ProtectedRoute';  

function App() {
  return (
    <ThemeProvider theme={theme}> {/* Wrap everything in ThemeProvider */}
      <GlobalStyles /> {/* Apply global styles */}
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protect the /main route */}
          <Route path="/main" element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          } />

          <Route path="/add-friend" element={
            <ProtectedRoute>
              <AddFriend />
            </ProtectedRoute>
          } />

          <Route path="/pending-requests" element={
            <ProtectedRoute>
              <PendingRequests />
            </ProtectedRoute>
          } />

          <Route path="/friends-list" element={
            <ProtectedRoute>
              <FriendsList />
            </ProtectedRoute>
          } />

          {/* Other protected routes here */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
