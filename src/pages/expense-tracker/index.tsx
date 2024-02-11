import { FormEvent, useState } from "react";
import { signOut } from "firebase/auth";
import useAddTransaction from "../../hooks/useAddTransaction";
import useGetTransactions from "../../hooks/useGetTransactions";
import useGetUserInfo from "../../hooks/useGetUserInfo";
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { dateParser } from "../../utils/dateParser";

const ExpenseTracker = () => {
  const { addTransaction } = useAddTransaction();
  const { transactions, transactionsByDate, transactionTotals } =
    useGetTransactions();
  console.log("transactions: ", transactions);
  const { name, profilePhoto } = useGetUserInfo();

  const [description, setDescription] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(0);
  const [transactionType, setTransactionType] = useState("expense");
  const navigate = useNavigate();

  const { balance, income, expenses } = transactionTotals;

  const onSubmit = async (e: FormEvent) => {
    console.log("e: ", e);
    e.preventDefault();
    addTransaction({
      description: description.trim(),
      transactionAmount,
      transactionType,
    });

    setDescription("");
    setTransactionAmount(0);
  };

  const signUserOut = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="expense-tracker">
        <Stack spacing={2}>
          <Typography component="h1" variant="h6" align="center" pt={1}>
            {name}'s Expense Tracker
          </Typography>

          {profilePhoto && (
            <Stack mt={2} spacing={1} alignItems="center">
              <Box
                component="img"
                src={profilePhoto}
                alt=""
                sx={{ width: "4rem", height: "4rem", borderRadius: "50%" }}
              />
              <Button variant="text" onClick={signUserOut}>
                Sign Out
              </Button>
            </Stack>
          )}

          <List>
            <ListItem>
              <ListItemText
                secondary="Your balance"
                primary={balance >= 0 ? `$${balance}` : `-$${balance * -1}`}
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                }}
              />

              <ListItemText
                secondary="Income"
                primary={`$${income}`}
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                }}
              />

              <ListItemText
                secondary="Expenses"
                primary={`$${expenses}`}
                sx={{
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                }}
              />
            </ListItem>
          </List>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography>Add new transaction:</Typography>
            <TextField
              label="Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              type="number"
              label="Amount"
              required
              value={transactionAmount}
              onChange={(e) => setTransactionAmount(Number(e.target.value))}
            />

            <RadioGroup
              row
              aria-label="transaction type"
              name="transaction-type"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
            >
              <FormControlLabel
                value="expense"
                label="Expense"
                control={<Radio />}
              />
              <FormControlLabel
                value="income"
                label="Income"
                control={<Radio />}
              />
            </RadioGroup>

            <Button
              variant="contained"
              disabled={
                transactionAmount === 0 || description.trim().length === 0
              }
              type="submit"
            >
              Add Transaction
            </Button>
          </Box>
        </Stack>
      </div>

      <Box mt={4}>
        <Typography variant="h4">Transactions</Typography>
        <List>
          {Object.keys(transactionsByDate).map((dateString) => (
            <div key={dateString}>
              <List dense>
                <Typography variant="h6">{dateString}</Typography>
                {transactionsByDate[dateString].map((transaction) => {
                  const { description, transactionAmount, transactionType } =
                    transaction;

                  return (
                    <ListItem key={transaction?.createdAt?.seconds}>
                      <ListItemText
                        primary={description}
                        secondary={transactionType}
                      />
                      <Typography variant="body1">
                        {`$${transactionAmount}`}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </div>
          ))}

          {/* {transactions.map((transaction) => {
            const {
              description,
              transactionAmount,
              transactionType,
              createdAt,
            } = transaction;

            const dateCreatedAt = new Date(createdAt.seconds * 1000);
            const { day, month, weekdayShort } = dateParser(dateCreatedAt);
            const dateString = `${day} ${month}, ${weekdayShort}`;

            return (
              <ListItem key={transaction?.createdAt?.seconds}>
                <ListItemText
                  primary={description}
                  secondary={transactionType}
                />
                <Typography variant="body1">
                  {`$${transactionAmount}`}
                </Typography>

                <Typography variant="caption">{dateString}</Typography>
              </ListItem>
            );
          })} */}
        </List>
      </Box>
    </>
  );
};

export default ExpenseTracker;
