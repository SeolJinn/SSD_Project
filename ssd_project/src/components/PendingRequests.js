import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth } from './firebase-config';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, getDoc, arrayUnion } from 'firebase/firestore';
import StyledButton from '../styles/StyledButton';
import { FaArrowLeft } from 'react-icons/fa';
import {
  PendingRequestsContainer,
  BackButton,
  Title,
  Message
} from '../styles/PendingRequestsStyles';

const PendingRequests = () => {
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          setMessage("Please log in to view friend requests.");
          return;
        }

        const incomingQuery = query(
          collection(db, "friendRequests"),
          where("toUserId", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const incomingSnapshot = await getDocs(incomingQuery);

        const incomingRequestsData = await Promise.all(
          incomingSnapshot.docs.map(async (requestDoc) => {
            const request = requestDoc.data();
            const fromUserId = request.fromUserId;
            const toUserId = request.toUserId;

            const fromUserDoc = await getDoc(doc(db, "users", fromUserId));
            const fromUserData = fromUserDoc.exists() ? fromUserDoc.data() : null;

            return { 
              id: requestDoc.id,
              fromUserId,
              toUserId,
              fromUsername: fromUserData ? fromUserData.username : "Unknown",
              status: request.status 
            };
          })
        );

        setIncomingRequests(incomingRequestsData);

        const outgoingQuery = query(
          collection(db, "friendRequests"),
          where("fromUserId", "==", currentUser.uid),
          where("status", "==", "pending")
        );
        const outgoingSnapshot = await getDocs(outgoingQuery);

        const outgoingRequestsData = await Promise.all(
          outgoingSnapshot.docs.map(async (requestDoc) => {
            const request = requestDoc.data();
            const fromUserId = request.fromUserId;
            const toUserId = request.toUserId;

            const toUserDoc = await getDoc(doc(db, "users", toUserId));
            const toUserData = toUserDoc.exists() ? toUserDoc.data() : null;

            return { 
              id: requestDoc.id,
              fromUserId,
              toUserId,
              toUsername: toUserData ? toUserData.username : "Unknown",
              status: request.status 
            };
          })
        );

        setOutgoingRequests(outgoingRequestsData);

      } catch (error) {
        console.error("Error fetching friend requests:", error);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (request) => {
    console.log("Processing request:", request); // Debugging log
    const { fromUserId, toUserId } = request;

    if (!fromUserId || !toUserId) {
      console.error("Missing user IDs in request:", request);
      setMessage("Invalid friend request data.");
      return;
    }

    try {
      const fromUserRef = doc(db, "users", fromUserId);
      const toUserRef = doc(db, "users", toUserId);

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
    <PendingRequestsContainer>
      <BackButton onClick={() => navigate('/main')}>
        <FaArrowLeft /> Back
      </BackButton>
      <Title>Pending Friend Requests</Title>
      {message && <Message>{message}</Message>}

      {incomingRequests.length > 0 ? (
        <>
          <h3>Incoming Requests</h3>
          <ul>
            {incomingRequests.map(request => (
              <li key={request.id}>
                Friend request from: {request.fromUsername}
                <StyledButton onClick={() => handleAccept(request)}>Accept</StyledButton>
                <StyledButton onClick={() => handleReject(request.id)}>Reject</StyledButton>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {outgoingRequests.length > 0 ? (
        <>
          <h3>Outgoing Requests</h3>
          <ul>
            {outgoingRequests.map(request => (
              <li key={request.id}>
                Friend request to: {request.toUsername}
                <StyledButton onClick={() => handleReject(request.id)}>Cancel Request</StyledButton>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
        <Message>No friend requests at the moment.</Message>
      )}
    </PendingRequestsContainer>
  );
};

export default PendingRequests;
