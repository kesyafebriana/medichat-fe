import { Timestamp } from "firebase/firestore";

export interface Message {
  id: string;
  userId: number;
  roomId: number;
  type: string;
  userName: string;
  role: string;
  createdAt: Timestamp;
  message: string;
  url: string;
}
