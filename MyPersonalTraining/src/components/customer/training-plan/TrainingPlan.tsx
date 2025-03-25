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
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;
  const [days, setDays] = useState<FirebaseObject[]>([]);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [exercises, setExercises] = useState<any[]>([]);

  useEffect(() => {
    const fetchDays = async () => {
      if (user?.id) {
        const fetchedDays = await FirestoreInterface.getPlanByCustomerId(
          user.id
        );
        setDays(fetchedDays || []);
      }
    };
    fetchDays();
  }, [user?.id]);

  useEffect(() => {
    if (
      days.length > 0 &&
      selectedDayIndex >= 0 &&
      selectedDayIndex < days.length
    ) {
      // Prendi il giorno selezionato direttamente tramite l'indice
      const selectedDay = days[selectedDayIndex];

      if (selectedDay) {
        setExercises(selectedDay.exercises || []);
      } else {
        console.error(`No exercises found for ${selectedDayIndex + 1}`);
        setExercises([]);
      }
    }
  }, [selectedDayIndex, days]);

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
          background: "rgb(147, 229, 165)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
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

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <IconButton onClick={handlePrev} disabled={selectedDayIndex === 0}>
            <ChevronLeft />
          </IconButton>

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

          <IconButton
            onClick={handleNext}
            disabled={selectedDayIndex === days.length - 1}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Exercises list */}
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
            Schedule ({days[selectedDayIndex]?.name || `Day ${selectedDayIndex + 1}`})
          </Typography>

          <BasicTable data={exercises} />
        </Box>
      </Paper>
    </Container>
  );
}