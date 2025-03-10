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

const CUSTOMERS_PER_PAGE = 10;

function Customers() {
  const [page, setPage] = useState<number>(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [customers, setCustomers] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const navigate = useNavigate();
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch on customers
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseCustomers = await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);
        const customerPromises = firebaseCustomers.map(async (firebaseCustomer) => {
          const customer = await FirestoreInterface.findUserById(firebaseCustomer.id);
          return customer;
        });
  
        // wait all the promises are solved
        const customers = await Promise.all(customerPromises);
  
        // filter the result set where customers are not null
        const validCustomers = customers.filter((customer) => customer !== null);
  
        setCustomers(validCustomers as FirebaseObject[]);
        console.log(validCustomers);
      }
    };

    fetchData(); // Update the customers
  }, []);

  // Retrieve customers based on a filter criteria
  const filteredCostumers: FirebaseObject[] = customers.filter(
    (customer: FirebaseObject) =>
      `${customer.Name} ${customer.Surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const startIndex: number = page * CUSTOMERS_PER_PAGE;
  const shownCustomers: FirebaseObject[] = filteredCostumers.slice(
    startIndex,
    startIndex + CUSTOMERS_PER_PAGE
  );

  // Change next page
  const handleNextPage = () => {
    if ((page + 1) * CUSTOMERS_PER_PAGE < filteredCostumers.length) {
      setPage(page + 1);
    }
  };

  // Change previous page
  const handlePrevPage = () => {
    if (page > 0) setPage(page - 1);
  };

  // Select/Deselect customers
  const handleToggle = (customer: FirebaseObject) => {
    setSelectedElements((prev: string[]) =>
      prev.includes(customer.id)
        ? prev.filter((c: string) => c !== customer.id)
        : [...prev, customer.id]
    );
  };

  // Remove customers
  const handleRemoveSelected = () => {
    setCustomers((prev: FirebaseObject[]) =>
      prev.filter(
        (customer: FirebaseObject) => !selectedElements.includes(customer.id)
      )
    );
    setSelectedElements([]); // Reset of selected customers
  };

  // Add a customer
  const handleAddClient = () => {
    const newCustomer = {
      id: `cliente_${customers.length + 1}`,
      Name: `Cliente ${customers.length + 1}`,
      Surname: "Nome",
    };
    setCustomers((prev) => [...prev, newCustomer]);
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
      <Container maxWidth="md">
        <Paper
          elevation={6}
          sx={{ p: 3, borderRadius: 5, bgcolor: "#fff", width: "100%" }}
        >
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
                sx={{
                  fontSize: "1rem",
                  mr: 1,
                  '&:hover': {
                    backgroundColor: 'rgb(22, 170, 42)',
                  },
                }}
              >
                Aggiungi
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemoveSelected}
                disabled={selectedElements.length === 0}
                sx={{ fontSize: "1rem" }}
              >
                Rimuovi
              </Button>
            </Box>
          </Box>

          {/* Search bar */}
          <TextField
            fullWidth
            label="Cerca cliente..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mb: 3, bgcolor: "white", borderRadius: 2 }}
          />

          {/* Customer list */}
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
              {shownCustomers.length > 0 ? (
                shownCustomers.map((customer) => (
                  <Fade in key={customer.id} timeout={300}>
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() =>
                            navigate(`/personalTrainer/customers/${customer.id}`)
                          }
                        >
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
                      <ListItemButton onClick={() => handleToggle(customer)}>
                        <Checkbox checked={selectedElements.includes(customer.id)} />
                        <ListItemText
                          primary={`${customer.Name} ${customer.Surname}`}
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

          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={3} gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 0}
              sx={{ fontSize: "1rem", px: 3 }}
            >
              Indietro
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNextPage}
              disabled={
                startIndex + CUSTOMERS_PER_PAGE >= filteredCostumers.length
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

export default Customers;