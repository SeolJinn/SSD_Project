import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [message, setMessage] = useState('');

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
            const friendsIds = userData.friends;

            const friendsData = await Promise.all(
                friendsIds.map(async (friendId) => {
                const friendDoc = await getDoc(doc(db, "users", friendId));
                const friendData = friendDoc.data();
                return { id: friendId, username: friendData.username || friendData.email };
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

    return (
        <div>
        <h2>Friends List</h2>
        {message && <p>{message}</p>}
        {friends.length > 0 ? (
            <ul>
            {friends.map((friend) => (
                <li key={friend.id}>{friend.username}</li>
            ))}
            </ul>
        ) : (
            <p>No friends to display.</p>
        )}
        </div>
    );
};

export default FriendsList;
