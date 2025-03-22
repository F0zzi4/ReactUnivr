import {
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Fade,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { ArrowForwardIos, Check } from "@mui/icons-material"; // Aggiungi l'icona Check
import { useState } from "react";
import React from "react";

interface GenericListProps {
  items: any[]; // Array of elements to show
  selectedItems: string[]; // Selected elements
  onToggle: (item: any) => void; // Handler select/deselect an element
  onItemClick: (itemId: any) => void; // Handler to click on an element
  primaryText: (item: any) => string; // Function to manage the primary text
  secondaryText?: (item: any) => string; // Function to manage the secondary text (optional)
  itemsPerPage?: number; // No of element per page (default=10)
  showSeriesReps?: boolean; // Enable series and repetitions fields
  onSeriesRepsChange?: (
    id: string,
    field: "Series" | "Reps",
    value: number
  ) => void;
  onSave?: (itemId: string, updatedItem: any) => void; // Callback for saving the updated item
  addedItems?: any[]; // List of items already added
}

function GenericList({
  items,
  selectedItems,
  onToggle,
  onItemClick,
  primaryText,
  secondaryText,
  itemsPerPage = 10, // Default value
  showSeriesReps = false,
  onSeriesRepsChange,
  onSave,
  addedItems = [], // Default to empty array
}: GenericListProps) {
  const [currentPage, setCurrentPage] = useState(0); // Current page state
  const [editingItemId, setEditingItemId] = useState<string | null>(null); // State for editing mode

  // Calculate the items to display for the current page
  const startIndex = currentPage * itemsPerPage;
  const shownItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Handler for next page
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler for previous page
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Function to toggle editing mode
  const handleEditToggle = (itemId: string) => {
    if (editingItemId === itemId) {
      // Se stiamo uscendo dalla modalità di modifica, salva le modifiche
      if (onSave) {
        const updatedItem = items.find((item) => item.id === itemId);
        if (updatedItem) {
          onSave(itemId, updatedItem);
        }
      }
      setEditingItemId(null); // Disabilita la modalità di modifica
    } else {
      // Se c'è già un elemento in modalità di modifica, salva le modifiche prima di passare al nuovo elemento
      if (editingItemId) {
        const currentEditedItem = items.find(
          (item) => item.id === editingItemId
        );
        if (currentEditedItem && onSave) {
          onSave(editingItemId, currentEditedItem);
        }
      }
      setEditingItemId(itemId); // Abilita la modalità di modifica per il nuovo elemento
    }
  };

  // Effect to handle page change if current page is empty after deletion
  React.useEffect(() => {
    const newShownItems = items.slice(startIndex, startIndex + itemsPerPage);
    if (newShownItems.length === 0 && currentPage > 0) {
      // Se la pagina corrente è vuota e non siamo sulla prima pagina, torna alla pagina precedente
      setCurrentPage(currentPage - 1);
    }
  }, [items, currentPage, itemsPerPage, startIndex]);

  return (
    <Box>
      {/* List of items */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 3,
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <List>
          {shownItems.length > 0 ? (
            shownItems.map((item) => {
              const isAdded = addedItems.some(
                (addedItem) => addedItem.id === item.id
              );

              return (
                <Fade in key={item.id} timeout={300}>
                  <ListItem
                    disablePadding
                    sx={{
                      transition: "transform 0.3s ease, background 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.02)",
                        backgroundColor: "#f4f4f4",
                      },
                      borderRadius: 2,
                      p: 1,
                      display: "flex", // Aggiungi questa linea per usare flexbox
                      alignItems: "center", // Allinea verticalmente gli elementi
                    }}
                  >
                    {/* Mostra una spunta se l'elemento è già aggiunto, altrimenti mostra la checkbox */}
                    {isAdded ? (
                      <Check
                        sx={{
                          color: "success.main",
                          mr: 2,
                          fontSize: "1.5rem",
                        }}
                      /> // Regola il fontSize per migliorarne la visibilità
                    ) : (
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onChange={() => onToggle(item)} // Only checkbox handles selection
                        sx={{
                          mr: 2, // Aggiungi un margine per distanziare la checkbox dal testo
                          alignSelf: "center", // Allinea la checkbox al centro
                        }}
                      />
                    )}

                    <ListItemText
                      primary={primaryText(item)}
                      secondary={secondaryText ? secondaryText(item) : null}
                      sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
                    />

                    {/* Show Series, Reps, and Edit if showSeriesReps is true */}
                    {showSeriesReps && (
                      <Box
                        display="flex"
                        alignItems="center"
                        ml={2}
                        justifyContent="right" // Horizontal layout for controls
                        sx={{
                          width: "auto",
                          flex: 1,
                          minWidth: 300, // Minimum width for proper layout
                        }}
                      >
                        {/* Series Field */}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <TextField
                            type="number"
                            value={item.Series} // Usa series come valore predefinito
                            onChange={(e) =>
                              onSeriesRepsChange &&
                              onSeriesRepsChange(
                                item.id,
                                "Series",
                                Number(e.target.value)
                              )
                            }
                            sx={{
                              width: 50,
                              mr: 1,
                              "& input[type=number]": {
                                "-moz-appearance": "textfield", // Nasconde le freccette in Firefox
                                textAlign: "center", // Centra il testo all'interno del TextField
                              },
                              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                  "-webkit-appearance": "none", // Nasconde le freccette in Chrome, Safari
                                  margin: 0,
                                },
                            }}
                            disabled={editingItemId !== item.id} // Only in edit mode
                          />
                          <Typography variant="body2">x</Typography>
                          <TextField
                            type="number"
                            value={item.Reps} // Usa reps come valore predefinito
                            onChange={(e) =>
                              onSeriesRepsChange &&
                              onSeriesRepsChange(
                                item.id,
                                "Reps",
                                Number(e.target.value)
                              )
                            }
                            sx={{
                              width: 50,
                              mr: 1,
                              ml: 1,
                              "& input[type=number]": {
                                "-moz-appearance": "textfield", // Nasconde le freccette in Firefox
                                textAlign: "center", // Centra il testo all'interno del TextField
                              },
                              "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                                {
                                  "-webkit-appearance": "none", // Nasconde le freccette in Chrome, Safari
                                  margin: 0,
                                },
                            }}
                            disabled={editingItemId !== item.id} // Only in edit mode
                          />
                        </Box>

                        {/* Edit Button, next to Series and Reps */}
                        <Box sx={{ display: "flex", gap: 1, ml: 1 }}>
                          <Button
                            variant={
                              editingItemId === item.id
                                ? "contained"
                                : "outlined"
                            } // Cambia il variant
                            size="small"
                            onClick={() => handleEditToggle(item.id)}
                            sx={{
                              minWidth: 55, // Set a minimum width for the button
                              color:
                                editingItemId === item.id ? "white" : "inherit", // Testo bianco in modalità "Save"
                              backgroundColor:
                                editingItemId === item.id
                                  ? "primary.main"
                                  : "inherit", // Colore di sfondo in modalità "Save"
                              "&:hover": {
                                backgroundColor:
                                  editingItemId === item.id
                                    ? "primary.dark"
                                    : "inherit", // Colore di sfondo al passaggio del mouse
                              },
                            }}
                          >
                            {editingItemId === item.id ? "Save" : "Edit"}
                          </Button>
                        </Box>
                      </Box>
                    )}

                    {/* Always visible navigation button */}
                    <Box ml={2}>
                      <IconButton edge="end" onClick={() => onItemClick(item)}>
                        <ArrowForwardIos />
                      </IconButton>
                    </Box>
                  </ListItem>
                </Fade>
              );
            })
          ) : (
            <Typography align="center" sx={{ py: 2, fontSize: "1.2rem" }}>
              No items found
            </Typography>
          )}
        </List>
      </Paper>

      {/* Pagination buttons */}
      <Box display="flex" justifyContent="center" mt={3} gap={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          sx={{
            fontSize: "1rem",
            px: 3,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(99, 132, 204)",
            },
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= items.length}
          sx={{
            fontSize: "1rem",
            px: 3,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgb(177, 85, 189)",
            },
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default GenericList;
