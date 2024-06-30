import { Timestamp } from "firebase-admin/firestore";

export interface Room {
  id: string;
  userId: number;
  doctorId: number;
  userName: string;
  doctorName: string;
  isTyping: string[];
  end: Timestamp;
  start: Timestamp;
}
