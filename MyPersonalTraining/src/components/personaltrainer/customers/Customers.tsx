import { useEffect, useState } from "react";
import {
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Checkbox,
  IconButton,
  Typography,
  Button,
  Box,
  Paper,
  Fade,
  TextField,
} from "@mui/material";
import { Delete, ArrowForwardIos, Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";

const CLIENTI_PER_PAGINA = 10;

function ClientList() {
  const [pagina, setPagina] = useState<number>(0);
  const [selezionati, setSelezionati] = useState<string[]>([]);
  const [costumers, setCostumers] = useState<FirebaseObject[]>([]); // Cambiato da clienti a costumers
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();

  // Fetch dei clienti
  useEffect(() => {
    const fetchData = async () => {
      const users = await FirestoreInterface.getAllCostumers();
      setCostumers(users); // Imposta lo stato con la lista di clienti
    };

    fetchData(); // Chiama la funzione asincrona all'interno di useEffect
  }, []); // L'array vuoto significa che questo effetto viene eseguito solo una volta al montaggio del componente

  // Filtra i clienti in base alla ricerca
  const clientiFiltrati: FirebaseObject[] = costumers.filter(
    (cliente: FirebaseObject) =>
      `${cliente.Name} ${cliente.Surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const startIndex: number = pagina * CLIENTI_PER_PAGINA;
  const clientiVisualizzati: FirebaseObject[] = clientiFiltrati.slice(
    startIndex,
    startIndex + CLIENTI_PER_PAGINA
  );

  // Cambio pagina
  const handleNextPage = () => {
    if ((pagina + 1) * CLIENTI_PER_PAGINA < clientiFiltrati.length) {
      setPagina(pagina + 1);
    }
  };

  const handlePrevPage = () => {
    if (pagina > 0) setPagina(pagina - 1);
  };

  // Selezione/deselezione clienti
  const handleToggle = (cliente: FirebaseObject) => {
    setSelezionati((prev: string[]) =>
      prev.includes(cliente.id)
        ? prev.filter((c: string) => c !== cliente.id)
        : [...prev, cliente.id]
    );
  };

  // Rimozione clienti selezionati
  const handleRemoveSelected = () => {
    setCostumers((prev: FirebaseObject[]) =>
      prev.filter(
        (cliente: FirebaseObject) => !selezionati.includes(cliente.id)
      )
    );
    setSelezionati([]); // Reset selezione
  };

  // Aggiunta di un nuovo cliente (questo va modificato per usare Firestore se vuoi aggiungere veri dati)
  const handleAddClient = () => {
    const nuovoCliente = {
      id: `cliente_${costumers.length + 1}`,
      Name: `Cliente ${costumers.length + 1}`,
      Surname: "Nome",
    };
    setCostumers((prev) => [...prev, nuovoCliente]);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{ p: 3, borderRadius: 5, bgcolor: "#fff", width: "100%" }}
        >
          {/* Barra superiore con ricerca e pulsanti */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "bold", fontSize: "2rem" }}
            >
              Lista Clienti
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={handleAddClient}
                sx={{ fontSize: "1rem", mr: 1 }}
              >
                Aggiungi
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemoveSelected}
                disabled={selezionati.length === 0}
                sx={{ fontSize: "1rem" }}
              >
                Rimuovi
              </Button>
            </Box>
          </Box>

          {/* Barra di ricerca */}
          <TextField
            fullWidth
            label="Cerca cliente..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }}
          />

          {/* Lista clienti */}
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
              {clientiVisualizzati.length > 0 ? (
                clientiVisualizzati.map((cliente) => (
                  <Fade in key={cliente.id} timeout={300}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() =>
                            navigate(`/personalTrainer/customers/${cliente.id}`)
                          }
                        >
                          <ArrowForwardIos />
                        </IconButton>
                      }
                      disablePadding
                      sx={{
                        transition: "transform 0.3s ease, background 0.3s ease", // Transizione per effetto hover
                        "&:hover": {
                          transform: "scale(1.02)", // Ingrandisce leggermente l'elemento
                          backgroundColor: "#f4f4f4", // Cambia colore di sfondo al passaggio del mouse
                        },
                        borderRadius: 2,
                        p: 1,
                      }}
                    >
                      <ListItemButton onClick={() => handleToggle(cliente)}>
                        <Checkbox checked={selezionati.includes(cliente.id)} />
                        <ListItemText
                          primary={`${cliente.Name} ${cliente.Surname}`} // Visualizza Nome e Cognome
                          sx={{ fontSize: "1.2rem", fontWeight: "bold" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Fade>
                ))
              ) : (
                <Typography align="center" sx={{ py: 2, fontSize: "1.2rem" }}>
                  Nessun cliente trovato
                </Typography>
              )}
            </List>
          </Paper>

          {/* Paginazione */}
          <Box display="flex" justifyContent="center" mt={3} gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={pagina === 0}
              sx={{ fontSize: "1rem", px: 3 }}
            >
              Indietro
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNextPage}
              disabled={
                startIndex + CLIENTI_PER_PAGINA >= clientiFiltrati.length
              }
              sx={{ fontSize: "1rem", px: 3 }}
            >
              Avanti
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default ClientList;
