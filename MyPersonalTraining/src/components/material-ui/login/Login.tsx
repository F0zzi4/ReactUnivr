import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import AppTheme from "../shared-theme/AppTheme";
import AppIcon from "../../../assets/mypersonaltraining.webp";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "../../firebase/authentication/firebase-appconfig";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FirebaseError } from "firebase/app";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import { Alert } from "@mui/material"; // Import Alert
import { Link } from "react-router-dom"; // Import Link
import "./Login.css";

const Card = styled(MuiCard)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  backgroundColor: "rgb(144, 238, 144)",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const inputElement = document.getElementById(
      "EmailInput"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate the inputs
    if (!validateInputs()) return;

    try {
      await signInWithEmailAndPassword(Auth, email, password);
      const user: FirebaseObject | null =
        await FirestoreInterface.getUserByEmail(email);

      // Setting session data
      if (user) {
        user.timestamp = Date.now();
        sessionStorage.setItem("user", JSON.stringify(user));
      }
      // Go to training-plan
      navigate("/inbox");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        setPasswordError(true);
        setPasswordErrorMessage("Error during login, try again.");
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const validateInputs = () => {
    let isValid = true;

    // Reset all errors before validation
    setEmailError(false);
    setEmailErrorMessage("");
    setPasswordError(false);
    setPasswordErrorMessage("");

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters long.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <div className="login-background">
      <AppTheme>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <Card
            variant="outlined"
            sx={{ backgroundColor: "rgb(147, 229, 165)" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <img
                src={AppIcon}
                alt="App Logo"
                style={{ width: "210px", height: "210px" }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{
                  fontSize: "clamp(2rem, 10vw, 2.15rem)",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                Sign in
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                gap: 2,
              }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="EmailInput"
                  error={emailError}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              {emailError && (
                <Alert
                  severity="error"
                  sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}
                >
                  {emailErrorMessage}
                </Alert>
              )}

              <FormControl>
                <FormLabel htmlFor="password">Password</FormLabel>
                <TextField
                  id="PasswordInput"
                  error={passwordError}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  type="password"
                  autoComplete="current-password"
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              {passwordError && (
                <Alert
                  severity="error"
                  sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}
                >
                  {passwordErrorMessage}
                </Alert>
              )}

              <br />
              <Button type="submit" fullWidth variant="contained">
                Sign in
              </Button>
            </Box>

            <Divider>or</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ textAlign: "center" }}>
                Don&apos;t have an account or having problems with access?<br />
                Send an email to:<br />
                <i>fozzatodavide@gmail.com</i>
                <br></br>
                <i>mattia.rebonato31@gmail.com</i>
              </Typography>
              <Link
                to="/reset-password"
                style={{ textAlign: "center", marginTop: "10px" }}
              >
                <Button 
                  variant="text" 
                  color="primary"
                  sx={{
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "rgb(36, 201, 118)", color: "white" }
                  }}
                  >
                  <b>Forgot Password?</b>
                </Button>
              </Link>
            </Box>
          </Card>
        </SignInContainer>
      </AppTheme>
    </div>
  );
}
