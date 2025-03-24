import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  TextField,
  Box,
  IconButton,
  Alert,
} from "@mui/material";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";

export default function GymGoals() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const [goals, setGoals] = useState<FirebaseObject[]>([]);
  const [newGoal, setNewGoal] = useState<FirebaseObject | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    const fetchGoals = async () => {
      if (user?.id) {
        const fetchedGoals = await FirestoreInterface.getGoalsByCustomerId(user.id);
        setGoals(Array.isArray(fetchedGoals) ? fetchedGoals : []);
      }
    };
    fetchGoals();
  }, [user?.id]);

  const toggleGoalCompletion = async (selectedGoal: FirebaseObject) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === selectedGoal.id ? { ...goal, completed: !goal.completed } : goal
    );
    setGoals(updatedGoals);
    await FirestoreInterface.updateGoalByCustomerId(user.id, {
      ...selectedGoal,
      completed: !selectedGoal.completed,
    });
  };

  const removeCompletedGoals = async () => {
    const completedGoals = goals.filter((goal) => goal.completed);
    await FirestoreInterface.removeGoalsByCustomerId(user.id, completedGoals);
    setGoals(goals.filter((goal) => !goal.completed));
  };

  const addGoal = async () => {
    if (!newGoal?.name || !newGoal?.targetValue) {
      setErrorMessage("⚠️ Both fields must be filled!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const latestGoals = await FirestoreInterface.getGoalsByCustomerId(user.id) || [];

      const isDuplicate = latestGoals.some(
        (goal) => goal.name === newGoal.name && goal.targetValue === newGoal.targetValue
      );

      if (isDuplicate) {
        setErrorMessage("⚠️ This goal already exists!");
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }

      const tempGoal: FirebaseObject = {
        id: crypto.randomUUID(),
        name: newGoal.name,
        targetValue: newGoal.targetValue,
        completed: false,
      };

      await FirestoreInterface.addGoalByCustomerId(user.id, tempGoal);

      const updatedGoals = await FirestoreInterface.getGoalsByCustomerId(user.id) || [];

      setGoals(updatedGoals);
      setNewGoal(null);
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 5,
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        {/* Add & Remove Completed Goals Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 mb-6">
          <IconButton
            onClick={removeCompletedGoals}
            sx={{
              color: "rgb(252, 252, 252)",
              backgroundColor: "rgb(200, 0, 0)",
              p: 0.5,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgb(150, 0, 0)",
                transform: "scale(1.1)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <DeleteIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              color: "#333",
              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            Gym Goals 🏋️‍♂️
          </Typography>
          <IconButton
            onClick={addGoal}
            sx={{
              color: "rgb(252, 252, 252)",
              backgroundColor: "rgb(38, 173, 45)",
              p: 0.5,
              width: 40,
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "&:hover": {
                backgroundColor: "rgb(16, 121, 30)",
                transform: "scale(1.1)",
                transition: "all 0.3s ease",
              },
            }}
          >
            <AddIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </div>

        {/* Goal list */}
        <List>
          {goals.map((goal) => (
            <ListItem
              key={goal.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                bgcolor: goal.completed ? "rgba(76, 175, 80, 0.2)" : "inherit",
                borderRadius: 2,
                mb: 1,
                transition: "background 0.3s ease",
                "&:hover": {
                  backgroundColor: goal.completed
                    ? "rgba(76, 175, 80, 0.4)"
                    : "rgba(200, 200, 200, 0.3)",
                },
              }}
            >
              <Checkbox
                checked={goal.completed}
                onChange={() => toggleGoalCompletion(goal)}
              />
              <ListItemText
                primary={`${goal.name} - ${goal.targetValue}`}
                secondary={goal.completed ? "Completed ✅" : "Ongoing ⏳"}
                sx={{
                  textDecoration: goal.completed ? "line-through" : "none",
                  fontWeight: "bold",
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Error message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Add new goal */}
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <TextField
            label="Exercise Name"
            variant="outlined"
            fullWidth
            value={newGoal?.name || ""}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value } as FirebaseObject)}
          />
          <TextField
            label="Goal (e.g., 100kg, 20 reps)"
            variant="outlined"
            fullWidth
            value={newGoal?.targetValue || ""}
            onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value } as FirebaseObject)}
          />
        </Box>
      </Paper>
    </Container>
  );
}