import {
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Fade,
  Box,
  Button,
} from "@mui/material";
import { ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";

interface GenericListProps {
  items: any[]; // Array di elementi da visualizzare
  selectedItems: string[]; // Elementi selezionati
  onToggle: (item: any) => void; // Handler per selezionare/deselezionare un elemento
  onItemClick: (itemId: string) => void; // Handler per cliccare su un elemento
  primaryText: (item: any) => string; // Funzione per ottenere il testo primario
  secondaryText?: (item: any) => string; // Funzione per ottenere il testo secondario (opzionale)
  itemsPerPage?: number; // Numero di elementi per pagina (opzionale, default 10)
}

function GenericList({
  items,
  selectedItems,
  onToggle,
  onItemClick,
  primaryText,
  secondaryText,
  itemsPerPage = 10, // Valore di default
}: GenericListProps) {
  const [currentPage, setCurrentPage] = useState(0); // Stato per la pagina corrente

  // Calcola gli elementi da visualizzare nella pagina corrente
  const startIndex = currentPage * itemsPerPage;
  const shownItems = items.slice(startIndex, startIndex + itemsPerPage);

  // Handler per la pagina successiva
  const handleNextPage = () => {
    if ((currentPage + 1) * itemsPerPage < items.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Handler per la pagina precedente
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Box>
      {/* Lista degli elementi */}
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
            shownItems.map((item) => (
              <Fade in key={item.id} timeout={300}>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" onClick={() => onItemClick(item)}>
                      <ArrowForwardIos />
                    </IconButton>
                  }
                  disablePadding
                  sx={{
                    transition: "transform 0.3s ease, background 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.02)",
                      backgroundColor: "#f4f4f4",
                    },
                    borderRadius: 2,
                    p: 1,
                  }}
                >
                  <ListItemButton onClick={() => onToggle(item)}>
                    <Checkbox checked={selectedItems.includes(item.id)} />
                    <ListItemText
                      primary={primaryText(item)}
                      secondary={secondaryText ? secondaryText(item) : null}
                      sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
                    />
                  </ListItemButton>
                </ListItem>
              </Fade>
            ))
          ) : (
            <Typography align="center" sx={{ py: 2, fontSize: "1.2rem" }}>
              No items found
            </Typography>
          )}
        </List>
      </Paper>

      {/* Bottoni di paginazione */}
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
          }, }}
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
          }, }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default GenericList;
