"use server"
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL

export const sendFriendRequest = async (senderId, receiverId) => {
    const response = await fetch(`${BASE_URL}/friend-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const acceptFriendRequest = async (senderId, receiverId) => {
    const response = await fetch(`${BASE_URL}/friend-request/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const rejectFriendRequest = async (senderId, receiverId) => {
    const response = await fetch(`${BASE_URL}/friend-request/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const getFriendRequests = async (userId) => {
    const response = await fetch(`${BASE_URL}/friend-requests`,{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    
    });
    return response.json();
  };
  export const getMessages = async (senderId,receiverId) => {
    const response = await fetch(`${BASE_URL}/messages`,{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId,receiverId }),
    
    });
    return response.json();
  };
  