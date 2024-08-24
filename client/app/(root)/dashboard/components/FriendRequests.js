"use client";
import { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/lib/ApiHelper";

export default function FriendRequests({ userId }) {
  const [friendRequests, setFriendRequests] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  const fetchFriendRequests = async () => {
    try {
      const requests = await getFriendRequests(userId);
      setFriendRequests(requests.pendingRequests);
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      setError("Failed to load friend requests. Please try again."); // Set error message
      setLoading(false); // Set loading to false on error
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFriendRequests();
    }
  }, [userId]);

  const handleAccept = async (senderId) => {
    try {
      await acceptFriendRequest(senderId, userId);
      setFriendRequests(friendRequests.filter((req) => req.sender_id !== senderId));
    } catch (error) {
      setError("Failed to accept the friend request. Please try again.");
    }
  };

  const handleReject = async (senderId) => {
    try {
      await rejectFriendRequest(senderId, userId);
      setFriendRequests(friendRequests.filter((req) => req.sender_id !== senderId));
    } catch (error) {
      setError("Failed to reject the friend request. Please try again.");
    }
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      {loading && <p>Loading friend requests...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && friendRequests.length === 0 && <p>No friend requests.</p>}
      {friendRequests.map((request) => (
        <div key={request.id}>
          <p>From: User {request.sender_id}</p>
          <button onClick={() => handleAccept(request.sender_id)}>Accept</button>
          <button onClick={() => handleReject(request.sender_id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
