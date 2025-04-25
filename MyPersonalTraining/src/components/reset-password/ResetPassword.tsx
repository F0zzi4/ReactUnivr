import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  Divider,
  Container,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import FirestoreInterface from "../firebase/firestore/firestore-interface";
import "../material-ui/login/Login.css";

const ResetPassword = () => {
  // State variables for form input and UI feedback
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Email validation function using regex
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handles form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents default form behavior (like page reload)
    // Clear previous messages and errors
    setErrorMessage("");
    setSuccessMessage("");
    setEmailError(false);
    setEmailErrorMessage("");

    // Basic validation checks
    if (!email) {
      setEmailError(true);
      setEmailErrorMessage("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true); // Disable UI during async operation

    try {
      // Attempt to send reset email via Firebase
      const message = await FirestoreInterface.resetPassword(email);
      setSuccessMessage(message || "Password reset link sent successfully!");
      // Navigate back to login after short delay
      setTimeout(() => navigate("/"), 5000);
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Show generic or specific error message
      setErrorMessage(
        error.message || "Failed to send reset link. Please try again."
      );
    } finally {
      setIsSubmitting(false); // Re-enable form
    }
  };

  return (
    <Container
      maxWidth={false}
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
      className="login-background"
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: "600px",
          borderRadius: 5,
          backgroundColor: "white",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              background:
                "linear-gradient(to right, rgb(50, 197, 112), rgb(30, 129, 71))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              mb: 1,
            }}
          >
            Password Recovery
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              color: "rgb(10, 59, 26)",
              fontWeight: "bold",
            }}
          >
            Enter your email to reset your password
          </Typography>
        </Box>

        {/* Form section */}
        <form onSubmit={handleSubmit}>
          {/* Email input field */}
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
              setEmailErrorMessage("");
            }}
            error={emailError}
            helperText={emailErrorMessage}
            disabled={isSubmitting}
            sx={{
              mb: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: "white",
                "&:hover fieldset": { borderColor: "rgb(30, 124, 62)" },
              },
            }}
          />

          {/* Display success or error messages */}
          {successMessage && (
            <Alert
              severity="success"
              sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}
            >
              {successMessage}
            </Alert>
          )}

          {errorMessage && (
            <Alert
              severity="error"
              sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}
            >
              {errorMessage}
            </Alert>
          )}

          {/* Submit button */}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              background:
                "linear-gradient(145deg, rgb(136, 196, 110), rgb(68, 184, 93))",
              "&:hover": { transform: "scale(1.02)", opacity: 0.9 },
              transition: "all 0.3s ease",
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        {/* Divider with alternative action */}
        <Divider sx={{ my: 3, color: "text.secondary" }}>or</Divider>

        {/* Link to go back to Sign In */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Chip
            component={Link}
            to="/"
            label="Return to Sign In"
            clickable
            sx={{
              fontWeight: "bold",
              color: "rgb(30, 129, 71)",
              "&:hover": { backgroundColor: "rgba(46, 204, 113, 0.1)" },
            }}
          />
        </Box>
      </Paper>
    </Container>
  );
};

export default ResetPassword;