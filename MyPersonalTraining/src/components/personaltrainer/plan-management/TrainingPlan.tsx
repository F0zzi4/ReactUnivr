import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
  Button,
  Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import GenericList from "../../generic-list/GenericList";
import { useNavigate, useLocation } from "react-router-dom";
import { Add, Delete, FilterList } from "@mui/icons-material";

export default function TrainingPlan() {
  const [selectedElementsToAdd, setSelectedElementsToAdd] = useState<string[]>(
    []
  );
  const [selectedElementsToRemove, setSelectedElementsToRemove] = useState<
    string[]
  >([]);
  const [exercises, setExercises] = useState<FirebaseObject[]>([]);
  const [addedExercises, setAddedExercises] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterTarget, setFilterTarget] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDay, setSelectedDay] = useState<string>("Day 1");
  const location = useLocation();
  const navigate = useNavigate();

  const customer = location.state;

  if (!customer) {
    navigate("/personalTrainer/plan-management");
  }

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const planId = user.id + "-" + customer.id;

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseExercises = await FirestoreInterface.getAllExercises();
        setExercises(firebaseExercises as FirebaseObject[]);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    const updateExercisesForDay = async () => {
      const newExercises = await FirestoreInterface.getExercisesPlanByDayNo(
        planId,
        selectedDay
      );
      setAddedExercises(newExercises ?? []);
    };

    updateExercisesForDay();
  }, [selectedDay]);

  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const filteredExercises = exercises?.filter((exercise) => {
    const matchesSearchTerm = `${exercise.Name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTarget = filterTarget
      ? exercise.Target === filterTarget
      : true;
    return matchesSearchTerm && matchesTarget;
  });

  const handleAddSelected = async () => {
    const newAddedExercises = exercises?.filter((exercise) =>
      selectedElementsToAdd.includes(exercise.id)
    );

    const exercisesWithDefaults = newAddedExercises.map((exercise) => ({
      ...exercise,
      Reps: 10, // Default reps
      Series: 4, // Default series
    }));

    setAddedExercises((prev) => {
      const updatedExercises = [
        ...prev,
        ...exercisesWithDefaults.filter(
          (e) => !prev.some((ae) => ae.id === e.id)
        ),
      ];

      FirestoreInterface.updatePlanById(planId, selectedDay, updatedExercises);

      return updatedExercises;
    });

    setSelectedElementsToAdd([]);
  };

  const handleSave = async (itemId: string, updatedItem: any) => {
    // Aggiorna l'elemento nella lista degli esercizi aggiunti
    setAddedExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === itemId ? { ...exercise, ...updatedItem } : exercise
      )
    );

    // Salva le modifiche nel database
    await FirestoreInterface.updatePlanById(
      planId,
      selectedDay,
      addedExercises
    );
  };

  const handleRemoveSelected = () => {
    setAddedExercises((prev) => {
      const updatedExercises = prev.filter(
        (exercise) => !selectedElementsToRemove.includes(exercise.id)
      );

      FirestoreInterface.updatePlanById(planId, selectedDay, updatedExercises);

      return updatedExercises;
    });

    setSelectedElementsToRemove([]);
  };

  const handleToggleAdd = (exercise: FirebaseObject) => {
    setSelectedElementsToAdd((prev) =>
      prev.includes(exercise.id)
        ? prev.filter((id) => id !== exercise.id)
        : [...prev, exercise.id]
    );
  };

  const handleToggleRemove = (exercise: FirebaseObject) => {
    setSelectedElementsToRemove((prev) =>
      prev.includes(exercise.id)
        ? prev.filter((id) => id !== exercise.id)
        : [...prev, exercise.id]
    );
  };

  const handleFilterSelect = (target: string | null) => {
    setFilterTarget(target);
    setAnchorEl(null);
  };

  const availableTargets = [
    ...new Set(exercises?.map((exercise) => exercise.Target)),
  ];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        p: 2,
      }}
    >
      <Container maxWidth="md" className="relative">
        <Paper
          elevation={6}
          sx={{ p: 3, borderRadius: 5, bgcolor: "#fff", width: "100%" }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
            flexDirection={isSmallScreen ? "column" : "row"}
            gap={isSmallScreen ? 2 : 0}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: isSmallScreen ? "1.5rem" : "2rem",
                textAlign: isSmallScreen ? "center" : "left",
              }}
            >
              Manage {customer.Name} {customer.Surname}'s Plan
            </Typography>
            <Box
              display="flex"
              gap={1}
              flexWrap={isSmallScreen ? "wrap" : "nowrap"}
              justifyContent={isSmallScreen ? "center" : "flex-end"}
            >
              <Button
                variant="contained"
                color="info"
                startIcon={<FilterList />}
                onClick={handleFilterClick}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem",
                  "&:hover": { backgroundColor: "rgb(37, 180, 236)" },
                  textTransform: "none",
                }}
              >
                Filter
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={handleAddSelected}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem",
                  "&:hover": { backgroundColor: "rgb(22, 170, 42)" },
                  textTransform: "none",
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemoveSelected}
                disabled={selectedElementsToRemove.length === 0}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem",
                  textTransform: "none",
                }}
              >
                Remove
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
              >
                <MenuItem onClick={() => handleFilterSelect(null)}>
                  All
                </MenuItem>
                {availableTargets.map((target) => (
                  <MenuItem
                    key={target}
                    onClick={() => handleFilterSelect(target)}
                  >
                    {target}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

          {/* Dropdown to select the day */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Choose day</InputLabel>
            <Select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              label="Choose Day"
              sx={{ bgcolor: "white", borderRadius: 2 }}
            >
              {[...Array(7)].map((_, index) => (
                <MenuItem key={index} value={`Day ${index + 1}`}>
                  Day {index + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/*SearchBar */}
          <TextField
            fullWidth
            label="Search exercise..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }}
          />

          {/* Available Exercise List */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Available Exercises
          </Typography>
          <GenericList
            items={filteredExercises}
            selectedItems={selectedElementsToAdd}
            onToggle={handleToggleAdd}
            primaryText={(exercise) => `${exercise.Name}`}
            secondaryText={(exercise) =>
              `Difficulty: ${exercise.Difficulty} | Target: ${exercise.Target}`
            }
            onItemClick={(exercise) => {
              navigate("/personalTrainer/exercises/exercise", {
                state: { exercise },
              });
            }}
            itemsPerPage={5}
            addedItems={addedExercises}
          />

          {/* Added Exercise List */}
          <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>
            Added Exercises
          </Typography>
          <GenericList
            items={addedExercises}
            selectedItems={selectedElementsToRemove}
            onToggle={handleToggleRemove}
            primaryText={(exercise) => `${exercise.Name}`}
            secondaryText={(exercise) =>
              `Difficulty: ${exercise.Difficulty} | Target: ${exercise.Target}`
            }
            onItemClick={(exercise) => {
              navigate("/personalTrainer/exercises/exercise", {
                state: { exercise },
              });
            }}
            itemsPerPage={5}
            showSeriesReps={true}
            onSave={handleSave}
            onSeriesRepsChange={(id, field, value) => {
              setAddedExercises((prev) =>
                prev.map((exercise) =>
                  exercise.id === id
                    ? { ...exercise, [field]: value }
                    : exercise
                )
              );
            }}
          />
        </Paper>
      </Container>
    </Box>
  );
}
