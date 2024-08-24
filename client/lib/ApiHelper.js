"use server";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Something went wrong');
  }
  return response.json();
};

export const sendFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error sending friend request:", error.message);
    throw error; // Re-throw the error to be handled by the caller
  }
};

export const acceptFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error accepting friend request:", error.message);
    throw error;
  }
};

export const rejectFriendRequest = async (senderId, receiverId) => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error rejecting friend request:", error.message);
    throw error;
  }
};

export const getFriendRequests = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/friend-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching friend requests:", error.message);
    throw error;
  }
};

export const getMessages = async (senderId, receiverId) => {
  try {
    const response = await fetch(`${BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ senderId, receiverId }),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    throw error;
  }
};
