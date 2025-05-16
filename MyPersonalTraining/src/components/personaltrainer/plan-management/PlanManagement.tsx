import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import GenericList from "../../generic-list/GenericList";
import { useNavigate } from "react-router-dom";

function PlanManagement() {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [plans, setPlan] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // check if the screen is small

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch exercises
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        try {
          // Get all plans
          const firebaseTrainingPlans =
            await FirestoreInterface.getAllPlansByPersonalTrainer(user.id);

          // For each plans take his related customer
          const plansWithCustomers = await Promise.all(
            firebaseTrainingPlans.map(async (plan) => {
              // Passing the customer id (splitting the id and taking the second string)
              const customer = await FirestoreInterface.getUserById(
                plan.id.split("-")[1]
              );
              return { ...plan, customer };
            })
          );

          setPlan(plansWithCustomers as FirebaseObject[]);
        } catch (error) {
          console.error("Error fetching training plans and customers:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  // Filter exercises based on search term and selected target
  const filteredPlans = plans.filter((plan) => {
    const matchesSearchTerm = `${plan.id}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesSearchTerm;
  });

  // Handler to select/deselect an exercise
  const handleToggle = (plan: FirebaseObject) => {
    setSelectedElements((prev) =>
      prev.includes(plan.id)
        ? prev.filter((id) => id !== plan.id)
        : [...prev, plan.id]
    );
  };

  // Remove selected plans
  const handleRemoveSelected = async () => {
    setPlan((prev) =>
      prev.filter((plan) => !selectedElements.includes(plan.id))
    );
    await FirestoreInterface.removeTrainingPlans(selectedElements);
    setSelectedElements([]);
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
              Training Plans
            </Typography>
            <Box
              display="flex"
              gap={1}
              flexWrap={isSmallScreen ? "wrap" : "nowrap"}
              justifyContent={isSmallScreen ? "center" : "flex-end"}
            >
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

          {/* Search bar */}
          <TextField
            fullWidth
            label="Search plan..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }}
          />

          {/* Training plan list */}
          <GenericList
            items={filteredPlans}
            selectedItems={selectedElements}
            onToggle={handleToggle}
            onItemClick={(plan) => {
              navigate("/personal-trainer/plan-management/training-plan", {
                state: plan.customer,
              });
            }}
            primaryText={(plan) =>
              `${plan.customer.Name + " " + plan.customer.Surname + "'s Plan"}`
            }
          />
        </Paper>
      </Container>
    </Box>
  );
}

export default PlanManagement;
