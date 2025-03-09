
export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Message {
  id: string;
  text: string;
  roomId: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    username: string;
  };
}

export interface Room {
  id: string;
  name: string;
  createdAt: string;
  messages?: Message[];
}
