"use client";
import { useState } from "react";
import { sendFriendRequest } from "@/lib/ApiHelper";

export default function SendFriendRequest({ senderId }) {
  const [receiverId, setReceiverId] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  const handleSendRequest = async () => {
    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      await sendFriendRequest(senderId, receiverId);
      setSuccessMessage("Friend request sent successfully!");
      setReceiverId("");
    } catch (err) {
      setError("Failed to send friend request. Please try again.");
    } finally {
      setLoading(false);
    }
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
      <button onClick={handleSendRequest} disabled={loading}>
        {loading ? "Sending..." : "Send Request"}
      </button>
      {successMessage && <p className="text-green-500">{successMessage}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
