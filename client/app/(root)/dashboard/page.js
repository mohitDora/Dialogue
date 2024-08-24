"use client";
import { getSocket } from "@/lib/socket";
import { useEffect, useState } from "react";
import { LogoutLink, useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import SendFriendRequest from "./components/sendFriendRequest";
import FriendRequests from "./components/FriendRequests";
import Friends from "./components/Friends";
import { getMessages } from "@/lib/ApiHelper";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const { user } = useKindeBrowserClient();

  useEffect(() => {
    if (user?.id) {
      setSenderId(user.id);
    }
  }, [user]);

  useEffect(() => {
    if (!senderId || !receiverId) return;

    const fetchMessages = async () => {
      try {
        const requests = await getMessages(senderId, receiverId);
        setMessages(requests);
        console.log("Fetched messages:", requests);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();

    const socket = getSocket();

    socket.on("message", (newMessage) => {
      if (
        (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.receiver_id === senderId) // Fixing the condition
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("message"); // Clean up socket listener on unmount
    };
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (message && senderId && receiverId) {
      const socket = getSocket();
      const newMessage = {
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
      };
      socket.emit("message", newMessage);
      setMessage("");
    } else {
      console.log("Message not sent: missing sender or receiver ID");
    }
  };

  return (
    <div>
      <p>send {senderId}</p>
      <div>
        {messages?.map((msg, index) => (
          <div key={index} className="font-mono">{msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
      <SendFriendRequest senderId={senderId} />
      <FriendRequests userId={senderId} />
      <Friends userId={senderId} setReceiverId={setReceiverId} />
      <LogoutLink postLogoutRedirectURL="https://dialogue-nine.vercel.app/">Log out</LogoutLink>
    </div>
  );
}
