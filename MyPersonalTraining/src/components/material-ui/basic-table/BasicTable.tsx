import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";

interface FirebaseObject {
  id: string;
  Name: string;
  Description?: string;
  Series: number;
  Reps: number;
  Difficulty?: string;
  Target?: string;
}

interface BasicTableProps {
  data: FirebaseObject[];
}

const BasicTable: React.FC<BasicTableProps> = ({ data }) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : null);
    };

  // Ordinamento personalizzato dei target
  const targetOrder = ["Chest", "Back", "Legs", "Shoulders", "Arms"];

  const sortedData = [...data].sort((a, b) => {
    const targetA = a.Target || "";
    const targetB = b.Target || "";

    const indexA = targetOrder.indexOf(targetA);
    const indexB = targetOrder.indexOf(targetB);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    return targetA.localeCompare(targetB);
  });

  let exerciseNumber = 1; // Numerazione dinamica degli esercizi

  const renderTableRow = (exercise: FirebaseObject, index: number) => {
    return (
      <React.Fragment key={exercise.id || index}>
        {/* Numerazione dinamica e riga per gli esercizi */}
        <TableRow
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "#e8f5e9" },
            textAlign: "center",
            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", // Alternanza delle righe
          }}
        >
          <TableCell
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
              color: "#388e3c", // Colore verde per il numero
            }}
          >
            {exerciseNumber++} {/* Numerazione dinamica */}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            {exercise.Name}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {`${exercise.Series}x${exercise.Reps}`}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {exercise.Difficulty || "N/A"}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            {exercise.Target || "N/A"}
          </TableCell>
          <TableCell sx={{ textAlign: "center" }}>
            <Accordion
              expanded={expanded === `panel${index}`}
              onChange={handleChange(`panel${index}`)}
              sx={{
                boxShadow: "none",
                m: 0,
                p: 0,
                backgroundColor: "transparent",
                minWidth: "fit-content",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <AccordionSummary
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  padding: 0,
                  display: "flex",
                  justifyContent: "center",
                  minHeight: "auto",
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                  },
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    transition: "all 0.2s ease",
                    borderRadius: "50%",
                    padding: "4px",
                    color: "rgba(0, 0, 0, 0.54)",
                    "&:hover": {
                      backgroundColor: "#4CAF50",
                      color: "white !important",
                    },
                  },
                  "&.Mui-expanded": {
                    minHeight: "auto",
                    "& .MuiAccordionSummary-expandIconWrapper": {
                      transform: "rotate(180deg)",
                      color: "rgba(0, 0, 0, 0.54)",
                    },
                  },
                }}
                expandIcon={<ExpandMore />}
              />
            </Accordion>
          </TableCell>
        </TableRow>
        {expanded === `panel${index}` && (
          <TableRow>
            <TableCell
              colSpan={6}
              sx={{
                p: 0,
                borderBottom: "none",
                textAlign: "center",
                width: "100%",
              }}
            >
              <AccordionDetails>
                <Typography
                  sx={{
                    p: 1,
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    color: "text.secondary",
                    overflowWrap: "break-word",
                  }}
                >
                  <b>Description:</b>
                  <br />
                  {exercise.Description || "No description available"}
                </Typography>
              </AccordionDetails>
            </TableCell>
          </TableRow>
        )}
      </React.Fragment>
    );
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflowX: "auto",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        maxWidth: "100%",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          "@media (max-width: 768px)": {
            tableLayout: "auto",
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ background: "linear-gradient(to right,rgb(50, 197, 112),rgb(30, 129, 71))" }}>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              #
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              Exercise
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              Series x Reps
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              Difficulty
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            >
              Target
            </TableCell>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" },
              }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((exercise, index) => renderTableRow(exercise, index))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
