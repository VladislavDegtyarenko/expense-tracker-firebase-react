import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import useGetUserInfo from "./useGetUserInfo";
import { TransactionDocument } from "../types/types";
import { Unsubscribe } from "firebase/auth";
import { dateParser } from "../utils/dateParser";

const groupTransactionsByDays = (transactions: TransactionDocument[]) => {
  const grouped: { [dateString: string]: TransactionDocument[] } = {};

  transactions.forEach((transaction) => {
    const dateCreatedAt = new Date(
      transaction?.createdAt?.seconds
        ? transaction.createdAt.seconds * 1000
        : new Date().getTime()
    );
    const { day, month, weekdayShort } = dateParser(dateCreatedAt);
    const dateString = `${day} ${month}, ${weekdayShort}`;

    if (!grouped[dateString]) {
      grouped[dateString] = [];
    }

    grouped[dateString].push(transaction);
  });

  return grouped;
};

const useGetTransactions = () => {
  const [transactions, setTransactions] = useState<TransactionDocument[]>([]);
  const [transactionTotals, setTransactionTotals] = useState({
    balance: 0.0,
    income: 0.0,
    expenses: 0.0,
  });

  const transactionsByDate = groupTransactionsByDays(transactions);

  const transactionCollectionRef = collection(db, "transactions");
  const { userID } = useGetUserInfo();

  const getTransactions = async () => {
    let unsubscribe: Unsubscribe;

    try {
      const queryTransactions = query(
        transactionCollectionRef,
        where("userID", "==", userID),
        orderBy("createdAt")
      );

      unsubscribe = onSnapshot(queryTransactions, (snapshot) => {
        let docs: TransactionDocument[] = [];
        let totalIncome = 0;
        let totalExpenses = 0;

        snapshot.forEach((doc) => {
          const data = doc.data() as TransactionDocument;
          const id = doc.id;

          docs.push({ ...data, id });

          if (data.transactionType === "expense") {
            totalExpenses += Number(data.transactionAmount);
          } else {
            totalIncome += Number(data.transactionAmount);
          }
        });

        setTransactions(docs);

        let balance = totalIncome - totalExpenses;
        setTransactionTotals({
          balance,
          expenses: totalExpenses,
          income: totalIncome,
        });
      });

      return () => unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTransactions();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { transactions, transactionTotals, transactionsByDate };
};

export default useGetTransactions;
