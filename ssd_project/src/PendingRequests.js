import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase-config'; 
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, getDoc, arrayUnion } from 'firebase/firestore';
import StyledButton from './StyledButton';

const PendingRequests = () => {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [outgoingRequests, setOutgoingRequests] = useState([]);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
        const fetchRequests = async () => {
          try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
              setMessage("Please log in to view friend requests.");
              return;
            }
      
            // Fetch incoming friend requests
            const incomingQuery = query(
              collection(db, "friendRequests"),
              where("toUserId", "==", currentUser.uid),
              where("status", "==", "pending")
            );
            const incomingSnapshot = await getDocs(incomingQuery);
      
            // Fetch the usernames of those who sent the requests
            const incomingRequestsData = await Promise.all(
              incomingSnapshot.docs.map(async (requestDoc) => {
                const request = requestDoc.data();
                const fromUserId = request.fromUserId;
      
                // Fetch the 'from' user's data
                const fromUserDoc = await getDoc(doc(db, "users", fromUserId));
                const fromUserData = fromUserDoc.exists() ? fromUserDoc.data() : null;
      
                return { 
                  id: requestDoc.id,
                  fromUserId,
                  toUserId: currentUser.uid, // Include toUserId here
                  fromUsername: fromUserData ? fromUserData.username : "Unknown",
                  status: request.status 
                };
              })
            ).then(results => results.filter(req => req !== null)); // Filter out any invalid results
      
            setIncomingRequests(incomingRequestsData);
      
            // Fetch outgoing friend requests
            const outgoingQuery = query(
              collection(db, "friendRequests"),
              where("fromUserId", "==", currentUser.uid),
              where("status", "==", "pending")
            );
            const outgoingSnapshot = await getDocs(outgoingQuery);
      
            const outgoingRequestsData = await Promise.all(
              outgoingSnapshot.docs.map(async (requestDoc) => {
                const request = requestDoc.data();
                const toUserId = request.toUserId;
      
                // Fetch the 'to' user's data
                const toUserDoc = await getDoc(doc(db, "users", toUserId));
                const toUserData = toUserDoc.exists() ? toUserDoc.data() : null;
      
                return { 
                  id: requestDoc.id,
                  fromUserId: currentUser.uid,
                  toUserId, // Include toUserId here
                  toUsername: toUserData ? toUserData.username : "Unknown",
                  status: request.status 
                };
              })
            ).then(results => results.filter(req => req !== null)); // Filter out any invalid results
      
            setOutgoingRequests(outgoingRequestsData);
      
          } catch (error) {
            console.error("Error fetching friend requests:", error);
          }
        };
      
        fetchRequests();
    }, []);
      
    const handleAccept = async (request) => {
        try {
            const { fromUserId, toUserId } = request;
        
            if (!fromUserId || !toUserId) {
                console.error("Missing user IDs in request:", request);
                setMessage("Invalid friend request data.");
                return;
            }
        
            const fromUserRef = doc(db, "users", fromUserId);
            const toUserRef = doc(db, "users", toUserId);
        
            const fromUserDoc = await getDoc(fromUserRef);
            const toUserDoc = await getDoc(toUserRef);
        
            if (!fromUserDoc.exists()) {
                console.error("From user document not found:", fromUserId);
                setMessage("User not found.");
                return;
            }
        
            if (!toUserDoc.exists()) {
                console.error("To user document not found:", toUserId);
                setMessage("User not found.");
                return;
            }
        
            await updateDoc(fromUserRef, {
                friends: arrayUnion(toUserId)
            });
        
            await updateDoc(toUserRef, {
                friends: arrayUnion(fromUserId)
            });
        
            await deleteDoc(doc(db, "friendRequests", request.id));
        
            setIncomingRequests(incomingRequests.filter(req => req.id !== request.id));
            setMessage("Friend request accepted!");
        } catch (error) {
            console.error("Error accepting friend request:", error);
            setMessage("Failed to accept friend request.");
        }
    };
        

    const handleReject = async (requestId) => {
        try {
        await deleteDoc(doc(db, "friendRequests", requestId));
        setIncomingRequests(incomingRequests.filter(req => req.id !== requestId));
        setMessage("Friend request rejected.");
        } catch (error) {
        console.error("Error rejecting friend request:", error);
        setMessage("Failed to reject friend request.");
        }
    };

    return (
        <div>
        <h2>Pending Friend Requests</h2>
        {message && <p>{message}</p>}

        <h3>Incoming Requests</h3>
        {incomingRequests.length === 0 ? (
            <p>No incoming friend requests.</p>
        ) : (
            <ul>
            {incomingRequests.map(request => (
                <li key={request.id}>
                Friend request from: {request.fromUsername}
                <StyledButton onClick={() => handleAccept(request)}>Accept</StyledButton>
                <StyledButton onClick={() => handleReject(request.id)}>Reject</StyledButton>
                </li>
            ))}
            </ul>
        )}

        <h3>Outgoing Requests</h3>
        {outgoingRequests.length === 0 ? (
            <p>No outgoing friend requests.</p>
        ) : (
            <ul>
            {outgoingRequests.map(request => (
                <li key={request.id}>
                Friend request to: {request.toUsername}
                <StyledButton onClick={() => handleReject(request.id)}>Cancel Request</StyledButton>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
};

export default PendingRequests;
