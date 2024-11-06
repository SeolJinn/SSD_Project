import React, { useState } from 'react';
import { db, auth } from './firebase-config';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

const AddFriend = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleAddFriend = async () => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setMessage('Please log in to add friends.');
                return;
            }

            if (email === currentUser.email) {
                setMessage("You can't send a friend request to yourself.");
                return;
            }

            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage('No user found with that email.');
                return;
            }

            const targetUser = querySnapshot.docs[0];
            const targetUserId = targetUser.id;

            const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
            const currentUserData = currentUserDoc.data();
            
            if (currentUserData && currentUserData.friends && currentUserData.friends.includes(targetUserId)) {
                setMessage('This user is already your friend.');
                return;
            }

            await addDoc(collection(db, "friendRequests"), {
                fromUserId: currentUser.uid,
                toUserId: targetUserId,
                status: "pending"
            });

            setMessage('Friend request sent!');
        } catch (error) {
            console.error('Error adding friend:', error);
            setMessage('Error sending friend request. Please try again.');
        }
    };

    return (
        <div>
        <h2>Add Friend</h2>
        <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Friend's email"
        />
        <button onClick={handleAddFriend}>Add Friend</button>
        {message && <p>{message}</p>}
        </div>
    );
};

export default AddFriend;
