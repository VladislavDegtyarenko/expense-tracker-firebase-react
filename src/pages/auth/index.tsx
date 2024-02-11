import { auth, provider } from "../../config/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, Navigate } from "react-router-dom";
import useGetUserInfo from "../../hooks/useGetUserInfo";

// MUI
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import GoogleIcon from "@mui/icons-material/Google";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Link from "@mui/material/Link";

const Auth = () => {
  const navigate = useNavigate();
  const { isAuth } = useGetUserInfo();

  const signInWithGoogle = async () => {
    const results = await signInWithPopup(auth, provider);
    const authInfo = {
      userID: results.user.uid,
      name: results.user.displayName,
      profilePhoto: results.user.photoURL,
      isAuth: true,
    };

    localStorage.setItem("auth", JSON.stringify(authInfo));
    navigate("/expense-tracker");
  };

  if (isAuth) {
    return <Navigate to="/expense-tracker" />;
  }

  return (
    <Stack
      spacing={4}
      alignItems="center"
      height="100%"
      justifyContent="center"
    >
      <Stack spacing={2} alignItems="center">
        <AccountBalanceWalletIcon
          sx={{
            width: "4rem",
            height: "4rem",
            color: "primary.main",
          }}
        />
        <Typography variant="h4" component="h1" fontWeight={700}>
          Expense Tracker
        </Typography>
      </Stack>
      <Typography>Sign in to Continue</Typography>
      <Button
        variant="outlined"
        className="login-with-google-btn"
        onClick={signInWithGoogle}
        startIcon={<GoogleIcon />}
      >
        Sign in with Google
      </Button>
      <Typography align="center" variant="body2" color="text.secondary">
        © Copyright 2024 |{" "}
        <Link href="https://vddeveloper.online/" target="_blank">
          Vladyslav Dihtiarenko
        </Link>
        <br />
        All Rights Reserved
      </Typography>
    </Stack>
  );
};

export default Auth;
