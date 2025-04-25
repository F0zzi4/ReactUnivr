import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import BasicTable from "../../material-ui/basic-table/BasicTable";

export default function CustomerTrainingPlan() {
  // Retrieve user information from session storage
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // State to store fetched training days and exercises
  const [days, setDays] = useState<FirebaseObject[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [exercises, setExercises] = useState<any[]>([]);

  // Fetch training plan days when component mounts or user changes
  useEffect(() => {
    const fetchDays = async () => {
      if (user?.id) {
        const fetchedDays = await FirestoreInterface.getDaysPlanByCustomerId(user.id);
        setDays(fetchedDays || []);
      }
    };
    fetchDays();
  }, [user?.id]);

  // Update exercises whenever a new day is selected
  useEffect(() => {
    if (
      days.length > 0 &&
      selectedDayIndex >= 0 &&
      selectedDayIndex < days.length
    ) {
      const selectedDay = days[selectedDayIndex];

      if (selectedDay) {
        setExercises(selectedDay.exercises || []);
      } else {
        console.error(`No exercises found for ${selectedDayIndex + 1}`);
        setExercises([]);
      }
    }
  }, [selectedDayIndex, days]);

  // Navigation handlers for switching days
  const handlePrev = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedDayIndex < days.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper
        elevation={6}
        sx={{
          p: 3,
          borderRadius: 5,
          background: "white",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(to right,rgb(50, 197, 112),rgb(30, 129, 71))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Training Plan
        </Typography>

        {/* If no days are available */}
        {days.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "text.secondary", fontStyle: "italic" }}
            >
              No training plan currently available
            </Typography>
          </Box>
        ) : (
          <>
            {/* Navigation buttons and day selection */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              {/* Previous Day Button */}
              <IconButton onClick={handlePrev} disabled={selectedDayIndex === 0}>
                <ChevronLeft />
              </IconButton>

              {/* Day buttons */}
              {days.map((day, index) => (
                <Button
                  key={day.id}
                  variant="contained"
                  onClick={() => setSelectedDayIndex(index)}
                  sx={{
                    minWidth: "110px",
                    height: "60px",
                    borderRadius: "16px",
                    textTransform: "none",
                    transition: "all 0.3s ease",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow:
                      index === selectedDayIndex
                        ? "0px 4px 15px rgba(25, 210, 118, 0.3)"
                        : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    background:
                      index === selectedDayIndex
                        ? "linear-gradient(145deg,rgb(114, 214, 155),rgb(37, 190, 101))"
                        : "linear-gradient(145deg,rgb(199, 235, 183),rgb(132, 230, 145))",
                    color:
                      index === selectedDayIndex ? "white" : "rgb(255, 255, 255)",
                    "&:hover": {
                      transform: "scale(1.10)",
                      boxShadow: "0px 6px 20px rgba(94, 155, 92, 0.4)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {day.name || `Day ${index + 1}`}
                  </Typography>
                </Button>
              ))}

              {/* Next Day Button */}
              <IconButton
                onClick={handleNext}
                disabled={selectedDayIndex === days.length - 1}
              >
                <ChevronRight />
              </IconButton>
            </Box>

            {/* Display exercises of selected day */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: "12px",
                background: "#fff",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  color: "rgb(58, 161, 110)",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                Schedule (
                {days[selectedDayIndex]?.name || `Day ${selectedDayIndex + 1}`})
              </Typography>

              {/* Table component to render exercise list */}
              <BasicTable data={exercises} />
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
}