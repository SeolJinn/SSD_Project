import React from 'react';
import styled from 'styled-components';
import { FaUser, FaUserFriends, FaClock, FaSignOutAlt, FaPlus } from 'react-icons/fa';

const SidebarContainer = styled.div`
  width: 80px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  height: 100vh;
  position: fixed;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  margin: 10px 0;
  color: ${({ theme }) => theme.colors.buttonText};
  font-size: 1.5rem;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

const Sidebar = ({ onNavigate }) => {
  return (
    <SidebarContainer>
      <IconButton onClick={() => onNavigate('/profile')}>
        <FaUser title="Profile/Settings" />
      </IconButton>
      <IconButton onClick={() => onNavigate('/add-friend')}>
        <FaPlus title="Add Friends" />
      </IconButton>
      <IconButton onClick={() => onNavigate('/pending-requests')}>
        <FaClock title="Pending Friend Requests" />
      </IconButton>
      <IconButton onClick={() => onNavigate('/friends-list')}>
        <FaUserFriends title="Friends List" />
      </IconButton>
      <IconButton onClick={() => onNavigate('/logout')}>
        <FaSignOutAlt title="Log Out" />
      </IconButton>
    </SidebarContainer>
  );
};

export default Sidebar;
