import { Timestamp } from "firebase/firestore";

export type TransactionInfo = {
  description: string;
  transactionAmount: number;
  transactionType: string;
};

export type TransactionType = "expense" | "income";

export type TransactionDocument = TransactionInfo & {
  createdAt: Timestamp;
  userID: string;
  id?: string;
};
