"use client";
import { useEffect, useState } from "react";
import { getFriendRequests, acceptFriendRequest, rejectFriendRequest } from "@/lib/ApiHelper";

export default function FriendRequests({ userId }) {
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      const requests = await getFriendRequests(userId);
      setFriendRequests(requests.pendingRequests);
      console.log(friendRequests)
    };
    fetchFriendRequests();
  }, [userId]);

  const handleAccept = async (senderId) => {
    await acceptFriendRequest(senderId, userId);
    setFriendRequests(friendRequests?.filter((req) => req.sender_id !== senderId));
  };

  const handleReject = async (senderId) => {
    await rejectFriendRequest(senderId, userId);
    setFriendRequests(friendRequests?.filter((req) => req.sender_id !== senderId));
  };

  return (
    <div>
      <h2>Friend Requests</h2>
      {friendRequests?.length === 0 && <p>No friend requests.</p>}
      {friendRequests?.map((request) => (
        <div key={request.id}>
          <p>From: User {request.sender_id}</p>
          <button onClick={() => handleAccept(request.sender_id)}>Accept</button>
          <button onClick={() => handleReject(request.sender_id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}
