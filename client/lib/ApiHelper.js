"use server"
export const sendFriendRequest = async (senderId, receiverId) => {
    const response = await fetch('http://localhost:4000/friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const acceptFriendRequest = async (senderId, receiverId) => {
    const response = await fetch('http://localhost:4000/friend-request/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const rejectFriendRequest = async (senderId, receiverId) => {
    const response = await fetch('http://localhost:4000/friend-request/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return response.json();
  };
  
  export const getFriendRequests = async (userId) => {
    const response = await fetch(`http://localhost:4000/friend-requests`,{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    
    });
    return response.json();
  };
  export const getMessages = async (senderId,receiverId) => {
    const response = await fetch(`http://localhost:4000/messages`,{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId,receiverId }),
    
    });
    return response.json();
  };
  