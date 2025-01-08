import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { FaArrowLeft, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  FriendsListContainer,
  BackButton,
  Title,
  FriendsListItem,
  FriendInfo,
  Avatar,
  DefaultAvatar,
  FriendName,
  UnfriendButton,
  Message,
  AchievementContainer,
  ExpandButton
} from '../styles/FriendListStyles';
import AchievementBadge from './AchievementBadge';
import { calculateLevel } from './Achievements';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState('');
  const [expandedFriend, setExpandedFriend] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setMessage('Please log in to view your friends list.');
          return;
        }

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const userData = userDoc.data();

        if (userData && userData.friends) {
          const friendsData = await Promise.all(
            userData.friends.map(async (friendId) => {
              const friendDoc = await getDoc(doc(db, "users", friendId));
              const friendData = friendDoc.data();
              return {
                id: friendId,
                username: friendData.username || friendData.email,
                profilePicture: friendData.profilePicture || null,
                messageCount: friendData.messageCount || 0,
                groupCount: friendData.groupCount || 0,
                friends: friendData.friends || []
              };
            })
          );
          setFriends(friendsData);
        } else {
          setMessage('You have no friends added yet.');
        }
      } catch (error) {
        console.error('Error fetching friends list:', error);
        setMessage('Failed to load friends list.');
      }
    };

    fetchFriends();
  }, []);

  const handleUnfriend = async (friendId) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setMessage('Please log in to manage your friends list.');
        return;
      }

      const currentUserRef = doc(db, "users", currentUser.uid);
      await updateDoc(currentUserRef, {
        friends: arrayRemove(friendId)
      });

      const friendRef = doc(db, "users", friendId);
      await updateDoc(friendRef, {
        friends: arrayRemove(currentUser.uid)
      });

      setFriends(friends.filter(friend => friend.id !== friendId));
      setMessage('Friend removed successfully.');
    } catch (error) {
      console.error('Error unfriending:', error);
      setMessage('Failed to remove friend.');
    }
  };

  const toggleExpand = (friendId) => {
    setExpandedFriend(expandedFriend === friendId ? null : friendId);
  };

  return (
    <FriendsListContainer>
      <BackButton onClick={() => navigate('/main')}>
        <FaArrowLeft /> Back
      </BackButton>
      <Title>Friends List</Title>
      {message && <Message>{message}</Message>}
      {friends.length > 0 ? (
        <ul>
          {friends.map((friend) => (
            <React.Fragment key={friend.id}>
              <FriendsListItem>
                <FriendInfo>
                  {friend.profilePicture ? (
                    <Avatar src={friend.profilePicture} alt={`${friend.username}'s avatar`} />
                  ) : (
                    <DefaultAvatar>{friend.username.charAt(0).toUpperCase()}</DefaultAvatar>
                  )}
                  <FriendName>{friend.username}</FriendName>
                </FriendInfo>
                
                <AchievementContainer>
                  <AchievementBadge
                    level={calculateLevel(friend.messageCount, 'MESSAGES')}
                    size="sm"
                  />
                  <AchievementBadge
                    level={calculateLevel(friend.friends.length, 'FRIENDS')}
                    size="sm"
                  />
                  <AchievementBadge
                    level={calculateLevel(friend.groupCount, 'GROUPS')}
                    size="sm"
                  />
                  <ExpandButton onClick={() => toggleExpand(friend.id)}>
                    {expandedFriend === friend.id ? <FaChevronUp /> : <FaChevronDown />}
                  </ExpandButton>
                </AchievementContainer>
                <UnfriendButton onClick={() => handleUnfriend(friend.id)}>Unfriend</UnfriendButton>
              </FriendsListItem>
              {expandedFriend === friend.id && (
                <div className="w-full p-4 bg-gray-50 border-t border-b border-gray-200">
                  <div>Messages Sent: {friend.messageCount}</div>
                  <div>Friends: {friend.friends.length}</div>
                  <div>Groups: {friend.groupCount}</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p>No friends to display.</p>
      )}
    </FriendsListContainer>
  );
};

export default FriendsList;