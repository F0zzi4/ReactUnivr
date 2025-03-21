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
} from "@mui/material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import GenericList from "../../generic-list/GenericList";
import { useLocation, useNavigate } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";

export default function TrainingPlan() {
  const [selectedElementsToAdd, setSelectedElementsToAdd] = useState<string[]>([]);
  const [selectedElementsToRemove, setSelectedElementsToRemove] = useState<string[]>([]);
  const [exercises, setExercises] = useState<FirebaseObject[]>([]);
  const [addedExercises, setAddedExercises] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  const customer = location.state;
  console.log(customer);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseExercises = await FirestoreInterface.getAllExercises();
        setExercises(firebaseExercises as FirebaseObject[]);
      }
    };

    fetchData();
  }, [user]);

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearchTerm = `${exercise.Name}`.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  // Aggiunge gli elementi selezionati alla lista "addedExercises"
  const handleAddSelected = () => {
    const newAddedExercises = exercises.filter((exercise) =>
      selectedElementsToAdd.includes(exercise.id)
    );

    setAddedExercises((prev) => [...prev, ...newAddedExercises.filter(e => !prev.some(ae => ae.id === e.id))]);

    setSelectedElementsToAdd([]);
  };

  // Rimuove gli elementi dalla seconda lista (Added Exercises)
  const handleRemoveSelected = () => {
    setAddedExercises((prev) =>
      prev.filter((exercise) => !selectedElementsToRemove.includes(exercise.id))
    );

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
        <Paper elevation={6} sx={{ p: 3, borderRadius: 5, bgcolor: "#fff", width: "100%" }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexDirection={isSmallScreen ? "column" : "row"} gap={isSmallScreen ? 2 : 0}>
            <Typography variant="h3" sx={{ fontWeight: "bold", fontSize: isSmallScreen ? "1.5rem" : "2rem", textAlign: isSmallScreen ? "center" : "left" }}>
              Manage {customer.Name} {customer.Surname}'s Plan
            </Typography>
            <Box display="flex" gap={1} flexWrap={isSmallScreen ? "wrap" : "nowrap"} justifyContent={isSmallScreen ? "center" : "flex-end"}>
              <Button variant="contained" color="success" startIcon={<Add />} onClick={handleAddSelected} sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem", "&:hover": { backgroundColor: "rgb(22, 170, 42)" }, textTransform: "none" }}>
                Add
              </Button>
              <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleRemoveSelected} disabled={selectedElementsToRemove.length === 0} sx={{ fontSize: isSmallScreen ? "0.875rem" : "1rem", textTransform: "none" }}>
                Remove
              </Button>
            </Box>
          </Box>

          {/* Search bar */}
          <TextField fullWidth label="Search exercise..." variant="outlined" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }} />

          {/* Exercise List (only to add) */}
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>Available Exercises</Typography>
          <GenericList
            items={filteredExercises}
            selectedItems={selectedElementsToAdd}
            onToggle={handleToggleAdd}
            primaryText={(exercise) => `${exercise.Name}`}
            secondaryText={(exercise) => `Difficulty: ${exercise.Difficulty} | Target: ${exercise.Target}`} 
            onItemClick={function (itemId: string): void {
            
            } }
            itemsPerPage={5}
          />

          {/* Added Exercises List (only to remove) */}
          <Typography variant="h5" sx={{ mt: 3, fontWeight: "bold" }}>Added Exercises</Typography>
          <GenericList
            items={addedExercises}
            selectedItems={selectedElementsToRemove}
            onToggle={handleToggleRemove}
            primaryText={(exercise) => `${exercise.Name}`}
            secondaryText={(exercise) => `Difficulty: ${exercise.Difficulty} | Target: ${exercise.Target}`} 
            onItemClick={function (itemId: string): void {
              throw new Error("Function not implemented.");
            } }
            itemsPerPage={5}          
          />
        </Paper>
      </Container>
    </Box>
  );
}
