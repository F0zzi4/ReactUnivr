import { useEffect, useState, useCallback } from "react";
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
  Chip,
  Pagination,
  Divider,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";

export default function GymGoals() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const [goals, setGoals] = useState<FirebaseObject[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<FirebaseObject[]>([]);
  const [newGoal, setNewGoal] = useState<Partial<FirebaseObject>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  // Memoized fetch function
  const fetchGoals = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const fetchedGoals = await FirestoreInterface.getGoalsByCustomerId(
        user.id
      );
      setGoals(Array.isArray(fetchedGoals) ? fetchedGoals : []);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setErrorMessage("Failed to load goals. Please refresh the page.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Fetch goals on mount and when user changes
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Apply filters whenever goals or filter changes
  useEffect(() => {
    let result = goals;
    if (filter === "completed") {
      result = goals.filter((goal) => goal.completed);
    } else if (filter === "active") {
      result = goals.filter((goal) => !goal.completed);
    }
    setFilteredGoals(result);
    setPage(1); // Reset to first page when filter changes
  }, [goals, filter]);

  // Pagination logic
  const paginatedGoals = filteredGoals.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  const pageCount = Math.ceil(filteredGoals.length / itemsPerPage);

  const toggleGoalCompletion = async (selectedGoal: FirebaseObject) => {
    if (!user?.id) return;

    const updatedCompletion = !selectedGoal.completed;
    try {
      // Optimistic update
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal.id === selectedGoal.id
            ? { ...goal, completed: updatedCompletion }
            : goal
        )
      );

      await FirestoreInterface.updateGoalByCustomerId(user.id, {
        ...selectedGoal,
        completed: updatedCompletion,
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      // Revert on error
      fetchGoals();
      setErrorMessage("Failed to update goal. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const removeCompletedGoals = async () => {
    if (!user?.id) return;

    try {
      // Optimistic update
      const newGoals = goals.filter((goal) => !goal.completed);
      setGoals(newGoals);

      const completedGoals = goals.filter((goal) => goal.completed);
      await FirestoreInterface.removeGoalsByCustomerId(user.id, completedGoals);
    } catch (error) {
      console.error("Error removing goals:", error);
      // Revert on error
      fetchGoals();
      setErrorMessage("Failed to remove goals. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const addGoal = async () => {
    if (!user?.id || !newGoal?.name || !newGoal?.targetValue) {
      setErrorMessage("⚠️ Both fields must be filled!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    try {
      const tempGoal: FirebaseObject = {
        id: crypto.randomUUID(),
        name: newGoal.name,
        targetValue: newGoal.targetValue,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Optimistic update
      setGoals((prev) => [...prev, tempGoal]);
      setNewGoal({});

      await FirestoreInterface.addGoalByCustomerId(user.id, tempGoal);
      // Refresh to ensure sync with server
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      // Revert on error
      fetchGoals();
      setErrorMessage("⚠️ Failed to add goal. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mb: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 5,
          background: "linear-gradient(145deg, #f5f7fa, #e4e8f0)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          position: "relative",
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
              color: "#2c3e50",
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
              mb: 1,
              background: "linear-gradient(to right, #3498db, #2c3e50)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Gym Goals Tracker
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "#7f8c8d", textAlign: "center" }}
          >
            Set your fitness targets and track your progress
          </Typography>
        </Box>

        {/* Stats and filter chips - Centered */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
            gap: 1,
          }}
        >
          <Chip
            label={`All: ${goals.length}`}
            variant={filter === "all" ? "filled" : "outlined"}
            color="primary"
            onClick={() => setFilter("all")}
          />
          <Chip
            label={`Active: ${goals.filter((g) => !g.completed).length}`}
            variant={filter === "active" ? "filled" : "outlined"}
            color="secondary"
            onClick={() => setFilter("active")}
          />
          <Chip
            label={`Completed: ${goals.filter((g) => g.completed).length}`}
            variant={filter === "completed" ? "filled" : "outlined"}
            color="success"
            onClick={() => setFilter("completed")}
          />
        </Box>

        {/* Goal list */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 200,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <List sx={{ mb: 2 }}>
              {paginatedGoals.length > 0 ? (
                paginatedGoals.map((goal) => (
                  <ListItem
                    key={goal.id}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      bgcolor: goal.completed
                        ? "rgba(46, 204, 113, 0.1)"
                        : "inherit",
                      borderRadius: 2,
                      mb: 1,
                      transition: "all 0.3s ease",
                      border: "1px solid rgba(0, 0, 0, 0.1)",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                        bgcolor: goal.completed
                          ? "rgba(46, 204, 113, 0.15)"
                          : "rgba(52, 152, 219, 0.1)",
                      },
                    }}
                  >
                    <Checkbox
                      checked={goal.completed}
                      onChange={() => toggleGoalCompletion(goal)}
                      color="success"
                    />
                    <ListItemText
                      primary={
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: goal.completed ? "#7f8c8d" : "#2c3e50",
                          }}
                        >
                          {goal.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          sx={{
                            color: goal.completed ? "#95a5a6" : "#34495e",
                          }}
                        >
                          Target: {goal.targetValue}
                          {goal.completed && (
                            <span
                              style={{
                                marginLeft: "8px",
                                color: "#27ae60",
                                fontWeight: "bold",
                              }}
                            >
                              ✓ Completed
                            </span>
                          )}
                        </Typography>
                      }
                      sx={{
                        textDecoration: goal.completed
                          ? "line-through"
                          : "none",
                        ml: 1,
                      }}
                    />
                  </ListItem>
                ))
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: "center",
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body1" color="textSecondary">
                    {filter === "all"
                      ? "No goals yet. Add your first goal!"
                      : filter === "completed"
                      ? "No completed goals yet"
                      : "No active goals. Great job!"}
                  </Typography>
                </Paper>
              )}
            </List>

            {/* Pagination */}
            {filteredGoals.length > itemsPerPage && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </Box>
            )}
          </>
        )}

        {/* Error message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2, borderRadius: 2, boxShadow: 1 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Add new goal section */}
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "#2c3e50",
              display: "flex",
              alignItems: "center",
            }}
          >
            <AddIcon sx={{ mr: 1 }} /> Add New Goal
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <TextField
              label="Exercise Name"
              variant="outlined"
              fullWidth
              size="small"
              value={newGoal?.name || ""}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  name: e.target.value,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            />
            <TextField
              label="Target Value"
              variant="outlined"
              fullWidth
              size="small"
              value={newGoal?.targetValue || ""}
              onChange={(e) =>
                setNewGoal({
                  ...newGoal,
                  targetValue: e.target.value,
                })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#3498db",
                  },
                },
              }}
            />
            <Tooltip title="Add Goal">
              <IconButton
                onClick={addGoal}
                sx={{
                  color: "white",
                  backgroundColor: "#3498db",
                  p: 1.5,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#2980b9",
                    transform: "scale(1.05)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Action buttons */}
        {goals.some((goal) => goal.completed) && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Tooltip title="Remove all completed goals">
              <IconButton
                onClick={removeCompletedGoals}
                sx={{
                  color: "white",
                  backgroundColor: "#e74c3c",
                  p: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#c0392b",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <DeleteIcon sx={{ mr: 1 }} />
                <Typography variant="button">Clear Completed</Typography>
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
