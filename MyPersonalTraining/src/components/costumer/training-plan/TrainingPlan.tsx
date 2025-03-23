import { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { getDay, startOfToday, addDays, format } from "date-fns";
import { it } from "date-fns/locale";

export default function CustomerTrainingPlan() {
  const today = startOfToday();

  // Riorganizza i giorni della settimana per iniziare da Lunedì
  const generateDays = () => {
    const daysOfWeek = [
      "Lunedì",
      "Martedì",
      "Mercoledì",
      "Giovedì",
      "Venerdì",
      "Sabato",
      "Domenica",
    ];
    return daysOfWeek;
  };

  const days = generateDays();

  // Converti l'indice del giorno corrente (0=domenica, 1=lunedì, ...) in base all'ordine personalizzato
  const getCustomDayIndex = (date: string | number | Date) => {
    const dayIndex = getDay(date); // 0=domenica, 1=lunedì, ..., 6=sabato
    return dayIndex === 0 ? 6 : dayIndex - 1; // Converti in 0=lunedì, 1=martedì, ..., 6=domenica
  };

  const [selectedDayIndex, setSelectedDayIndex] = useState(
    getCustomDayIndex(today)
  ); // Giorno selezionato, di default oggi

  // Funzione per gestire lo spostamento indietro
  const handlePrev = () => {
    if (selectedDayIndex > 0) {
      setSelectedDayIndex(selectedDayIndex - 1);
    }
  };

  // Funzione per gestire lo spostamento avanti
  const handleNext = () => {
    if (selectedDayIndex < days.length - 1) {
      setSelectedDayIndex(selectedDayIndex + 1);
    }
  };

  // Calcola i giorni visibili in base al giorno selezionato
  const getVisibleDays = () => {
    const visibleDays = [];
    const startIndex = Math.max(0, selectedDayIndex - 2); // Inizia 2 giorni prima del giorno selezionato
    const endIndex = Math.min(days.length - 1, selectedDayIndex + 2); // Termina 2 giorni dopo il giorno selezionato

    for (let i = startIndex; i <= endIndex; i++) {
      // Calcola la data corretta in base alla posizione del giorno nella settimana
      const date = addDays(today, i - getCustomDayIndex(today));
      visibleDays.push({
        name: days[i],
        date: format(date, "dd/MM", { locale: it }), // Formato gg/mm
      });
    }

    return visibleDays;
  };

  const visibleDays = getVisibleDays();

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

        {/* Selettore giorni */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <IconButton
            onClick={handlePrev}
            disabled={selectedDayIndex === 0} // Disabilita se è il primo giorno (Lunedì)
            sx={{
              borderRadius: "50%",
              background: "linear-gradient(145deg, #e0e0e0, #f5f5f5)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                background: "linear-gradient(145deg, #d0d0d0, #e0e0e0)",
              },
              "&:disabled": {
                background: "#f5f5f5",
                color: "#bdbdbd",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ChevronLeft />
          </IconButton>

          {/* Mostra solo 5 giorni con il giorno selezionato al centro */}
          {visibleDays.map((day, index) => (
            <Button
              key={index}
              variant={
                days.indexOf(day.name) === selectedDayIndex
                  ? "contained"
                  : "outlined"
              }
              onClick={() => setSelectedDayIndex(days.indexOf(day.name))}
              sx={{
                textTransform: "none",
                minWidth: "100px",
                borderRadius: "20px",
                background:
                  days.indexOf(day.name) === selectedDayIndex
                    ? "linear-gradient(145deg, #1976D2, #1565C0)"
                    : "transparent",
                color:
                  days.indexOf(day.name) === selectedDayIndex
                    ? "white"
                    : "#333",
                boxShadow:
                  days.indexOf(day.name) === selectedDayIndex
                    ? "0px 4px 15px rgba(25, 118, 210, 0.3)"
                    : "0px 4px 10px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  background:
                    days.indexOf(day.name) === selectedDayIndex
                      ? "linear-gradient(145deg, #1565C0, #115293)"
                      : "#f1f1f1",
                  boxShadow:
                    days.indexOf(day.name) === selectedDayIndex
                      ? "0px 6px 20px rgba(25, 118, 210, 0.4)"
                      : "0px 6px 15px rgba(0, 0, 0, 0.2)",
                },
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.5,
                transition: "all 0.3s ease",
              }}
            >
              <Typography
                variant="body1"
                sx={{ fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {day.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color:
                    days.indexOf(day.name) === selectedDayIndex
                      ? "white"
                      : "#666",
                  fontSize: "0.9rem",
                }}
              >
                {day.date}
              </Typography>
            </Button>
          ))}

          <IconButton
            onClick={handleNext}
            disabled={selectedDayIndex === days.length - 1} // Disabilita se è l'ultimo giorno (Domenica)
            sx={{
              borderRadius: "50%",
              background: "linear-gradient(145deg, #e0e0e0, #f5f5f5)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              "&:hover": {
                background: "linear-gradient(145deg, #d0d0d0, #e0e0e0)",
              },
              "&:disabled": {
                background: "#f5f5f5",
                color: "#bdbdbd",
                boxShadow: "none",
              },
              transition: "all 0.3s ease",
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
