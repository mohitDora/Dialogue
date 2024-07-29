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
    setSenderId(user?.id)
  }, [user]);

  useEffect(() => {
    if (!senderId && !receiverId) return;

    const fetchFriendRequests = async () => {
      const requests = await getMessages(senderId,receiverId);
      setMessages(requests);
      console.log("msg",requests)
    };
    fetchFriendRequests();

    const socket = getSocket();
    socket.on("message", (newMessage) => {
      if (
        (newMessage.sender_id === senderId && newMessage.receiver_id === receiverId) ||
        (newMessage.sender_id === receiverId && newMessage.sender_id === senderId)
      ) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.off("message");
    };
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (message) {
      const socket = getSocket();
      const newMessage = {
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
      };
      socket.emit("message", newMessage);
      setMessage("");
    }
  };

  return (
    <div>
      <p>send{senderId}</p>
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
      <Friends userId={senderId} setReceiverId={setReceiverId}/>
      <LogoutLink>Log out</LogoutLink>
    </div>
  );
}
