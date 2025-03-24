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
        const fetchedDays = await FirestoreInterface.getPlanByCustomerId(user.id);
        setDays(fetchedDays || []);
      }
    };
    fetchDays();
  }, [user?.id]);

  useEffect(() => {
    if (days.length > 0) {
      const dayName = `Day ${selectedDayIndex + 1}`;
  
      // Find the related array element "Day X"
      const selectedDay = days.find(day => day.name === dayName);
  
      setExercises(selectedDay?.exercises || []);
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
          background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: "#333",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          Training Plan
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 3 }}>
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
                boxShadow: index === selectedDayIndex
                  ? "0px 4px 15px rgba(25, 118, 210, 0.3)"
                  : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                background: index === selectedDayIndex
                  ? "linear-gradient(145deg,rgb(60, 173, 50),rgb(22, 192, 59))"
                  : "linear-gradient(145deg,rgb(240, 240, 240),rgb(255, 255, 255))",
                color: index === selectedDayIndex ? "white" : "rgb(17, 131, 46)",
                "&:hover": {
                  background: index === selectedDayIndex
                    ? "linear-gradient(145deg,rgb(73, 194, 57),rgb(31, 180, 51))"
                    : "#f5f5f5",
                  transform: "scale(1.10)",
                  boxShadow: "0px 6px 20px rgba(94, 155, 92, 0.4)",
                },
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>{day.name || `Day ${index + 1}`}</Typography>
              {/* <Typography variant="body2" sx={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                {format(new Date(day.timestamp || Date.now()), "dd/MM", { locale: it })}
              </Typography> */}
            </Button>
          ))}

          <IconButton onClick={handleNext} disabled={selectedDayIndex === days.length - 1}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Box con la lista degli esercizi */}
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
              color: "rgb(59, 148, 51)",
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