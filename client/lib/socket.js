import io from 'socket.io-client';

let socket;
const BASE_URL=process.env.NEXT_PUBLIC_BASE_URL
export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL);
  }
  return socket;
};
