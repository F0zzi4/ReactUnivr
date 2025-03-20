import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import GenericList from "../../generic-list/GenericList"; // Generic list component
import { useNavigate } from "react-router-dom";
import { Add, Delete } from "@mui/icons-material";

interface TrainingPlanProps {
  onClose: () => void; // function used on closing window
  CustomerName : string;
  CustomerSurname : string;
}

export default function TrainingPlan({ onClose, CustomerName, CustomerSurname }: TrainingPlanProps) {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [exercises, setExercises] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterTarget, setFilterTarget] = useState<string | null>(null); // State for filtering by target
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for the filter menu
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Controlla se lo schermo è piccolo

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch exercises
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseExercises = await FirestoreInterface.getAllExercises();
        setExercises(firebaseExercises as FirebaseObject[]);
      }
    };

    fetchData();
  }, [user]);

  // Extract unique targets from exercises
  const availableTargets = [
    ...new Set(exercises.map((exercise) => exercise.Target)),
  ];

  // Filter exercises based on search term and selected target
  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearchTerm = `${exercise.Name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesTarget = filterTarget
      ? exercise.Target === filterTarget
      : true;
    return matchesSearchTerm && matchesTarget;
  });

  // Remove selected exercises
  const handleAddSelected = () => {
    setExercises((prev) =>
      prev.filter((exercise) => !selectedElements.includes(exercise.id))
    );
    alert(selectedElements);
    setSelectedElements([]);
  };

  // Remove selected exercises
  const handleRemoveSelected = () => {
    setExercises((prev) =>
      prev.filter((exercise) => !selectedElements.includes(exercise.id))
    );
    FirestoreInterface.deleteExercises(selectedElements);
    setSelectedElements([]);
  };
  
  // Handler to select/deselect an exercise
  const handleToggle = (exercise: FirebaseObject) => {
    setSelectedElements((prev) =>
      prev.includes(exercise.id)
        ? prev.filter((id) => id !== exercise.id)
        : [...prev, exercise.id]
    );
  };

  // Handler for selecting a target filter
  const handleFilterSelect = (target: string | null) => {
    setFilterTarget(target);
    setAnchorEl(null); // Close the menu
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
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
            flexDirection={isSmallScreen ? "column" : "row"} // Cambia direzione su schermi piccoli
            gap={isSmallScreen ? 2 : 0} // Aggiunge spazio verticale su schermi piccoli
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: isSmallScreen ? "1.5rem" : "2rem", // Riduci la dimensione del testo su schermi piccoli
                textAlign: isSmallScreen ? "center" : "left", // Centra il testo su schermi piccoli
              }}
            >
              Manage {CustomerName} {CustomerSurname}'s Plan
            </Typography>
            <Box
              display="flex"
              gap={1} // Reduce space between buttons
              flexWrap={isSmallScreen ? "wrap" : "nowrap"} // Wrap buttons on small screens
              justifyContent={isSmallScreen ? "center" : "flex-end"} // Center buttons on small screens
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={handleAddSelected}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem", // Reduce text size on small screens
                  "&:hover": {
                    backgroundColor: "rgb(22, 170, 42)",
                  },
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
                disabled={selectedElements.length === 0}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem", // Reduce text size on small screens
                  textTransform: "none",
                }}
              >
                Remove
              </Button>
            </Box>
          </Box>

          {/* Filter menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => handleFilterSelect(null)}>All</MenuItem>
            {availableTargets.map((target) => (
              <MenuItem key={target} onClick={() => handleFilterSelect(target)}>
                {target}
              </MenuItem>
            ))}
          </Menu>

          {/* Search bar */}
          <TextField
            fullWidth
            label="Search exercise..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }}
          />

          {/* Exercise list */}
          <GenericList
            items={filteredExercises}
            selectedItems={selectedElements}
            onToggle={handleToggle}
            onItemClick={(exercise) => {
              navigate("/personalTrainer/exercises/exercise", {
                state: { exercise },
              });
            }}
            primaryText={(exercise) => `${exercise.Name}`}
            secondaryText={(exercise) =>
              `Difficulty: ${exercise.Difficulty} | Target: ${exercise.Target}`
            }
          />
        </Paper>
      </Container>
    </div>
  );
}