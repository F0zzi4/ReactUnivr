import * as React from "react";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  FormLabel,
  FormControl,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Alert,
} from "@mui/material";
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
import { Link } from "react-router-dom";
import "./Login.css";

// Styled card component for the login form
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

// Styled container for full-page login layout
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
  // State for form fields and validation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const navigate = useNavigate();

  // Automatically focus email input when component mounts
  useEffect(() => {
    const inputElement = document.getElementById("EmailInput") as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  // Handles form submission and Firebase sign-in
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateInputs()) return;

    try {
      await signInWithEmailAndPassword(Auth, email, password);

      // Fetch user data after successful login
      const user: FirebaseObject | null = await FirestoreInterface.getUserByEmail(email);

      // Store user session in local storage
      if (user) {
        user.timestamp = Date.now();
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      // Redirect user to inbox page
      navigate("/inbox");
    } catch (error: unknown) {
      // Handle Firebase authentication error
      if (error instanceof FirebaseError) {
        setPasswordError(true);
        setPasswordErrorMessage("Error during login, try again.");
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  // Input validation logic for email and password
  const validateInputs = () => {
    let isValid = true;
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
          {/* Login card */}
          <Card variant="outlined" sx={{ backgroundColor: "rgb(147, 229, 165)" }}>
            {/* Logo and title */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1 }}>
              <img src={AppIcon} alt="App Logo" style={{ width: "210px", height: "210px" }} />
              <Typography component="h1" variant="h4" sx={{
                fontSize: "clamp(2rem, 10vw, 2.15rem)",
                fontWeight: "bold",
                textAlign: "center",
              }}>
                Sign in
              </Typography>
            </Box>

            {/* Login form */}
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
              {/* Email input */}
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
                <Alert severity="error" sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}>
                  {emailErrorMessage}
                </Alert>
              )}

              {/* Password input */}
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
                <Alert severity="error" sx={{ mt: 1, borderRadius: 2, boxShadow: 1 }}>
                  {passwordErrorMessage}
                </Alert>
              )}

              {/* Submit button */}
              <br />
              <Button type="submit" fullWidth variant="contained">
                Sign in
              </Button>
            </Box>

            {/* Divider and contact section */}
            <Divider>or</Divider>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography sx={{ textAlign: "center" }}>
                Don&apos;t have an account or having problems with access?<br />
                Send an email to:<br />
                <i>fozzatodavide@gmail.com</i><br />
                <i>mattia.rebonato31@gmail.com</i>
              </Typography>

              {/* Forgot password button */}
              <Link to="/reset-password" style={{ textAlign: "center", marginTop: "10px" }}>
                <Button
                  variant="text"
                  color="primary"
                  sx={{
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "rgb(36, 201, 118)",
                      color: "white",
                    },
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