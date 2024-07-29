"use client";
import { useState } from "react";
import { sendFriendRequest } from "@/lib/ApiHelper";

export default function SendFriendRequest({ senderId }) {
  const [receiverId, setReceiverId] = useState("");

  const handleSendRequest = async () => {
    await sendFriendRequest(senderId, receiverId);
    setReceiverId("");
    alert("Friend request sent!");
  };

  return (
    <div>
      <h2>Send Friend Request</h2>
      <input
        type="text"
        placeholder="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
      />
      <button onClick={handleSendRequest}>Send Request</button>
    </div>
  );
}
