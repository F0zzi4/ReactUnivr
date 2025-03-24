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
  Box,
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

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        overflowX: "auto", // Permette lo scroll orizzontale sui dispositivi piccoli
        boxShadow: 0,
        maxWidth: "100%",
      }}
    >
      <Table
        sx={{
          minWidth: 650,
          "@media (max-width: 768px)": {
            tableLayout: "auto", // Usa auto per adattarsi alla larghezza
          },
        }}
      >
        <TableHead>
          <TableRow sx={{ backgroundColor: "#4CAF50" }}>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "0.8rem", sm: "1rem" }, // Riduci la dimensione su dispositivi piccoli
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
          {data.map((exercise, index) => (
            <React.Fragment key={exercise.id || index}>
              <TableRow
                sx={{
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#f5f5f5" },
                  textAlign: "center",
                }}
              >
                <TableCell sx={{ textAlign: "center" }}>
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
                    colSpan={5}
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
                        <b>Descrizione:</b>
                        <br />
                        {exercise.Description || "No description available"}
                      </Typography>
                    </AccordionDetails>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
