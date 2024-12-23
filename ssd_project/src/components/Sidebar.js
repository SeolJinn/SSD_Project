import React from 'react';
import { FaUser, FaUserFriends, FaClock, FaSignOutAlt, FaPlus } from 'react-icons/fa';
import {
  SidebarContainer,
  IconButton
} from '../styles/SidebarStyles';

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
