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
import AddCustomer from "../addcustomer/AddCustomer";

const CUSTOMERS_PER_PAGE = 10;

function Customers() {
  const [page, setPage] = useState<number>(0);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [customers, setCustomers] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch on customers
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseCustomers =
          await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);
        const customerPromises = firebaseCustomers.map(
          async (firebaseCustomer) => {
            const customer = await FirestoreInterface.findUserById(
              firebaseCustomer.id
            );
            return customer;
          }
        );

        // wait all the promises are solved
        const customers = await Promise.all(customerPromises);

        // filter the result set where customers are not null
        const validCustomers = customers.filter(
          (customer) => customer !== null
        );

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
      {isModalOpen && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // background darker to hide the background content when open the modal form (AddCustomer)
            zIndex: 10, // it has a z index lower than the box overlayed
          }}
        />
      )}
      <Container maxWidth="md" className="relative">
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
              Customer List
            </Typography>
            <Box>
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  fontSize: "1rem",
                  mr: 1,
                  "&:hover": {
                    backgroundColor: "rgb(22, 170, 42)",
                  },
                  textTransform: "none"
                }}
              >
                Add
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Delete />}
                onClick={handleRemoveSelected}
                disabled={selectedElements.length === 0}
                sx={{ fontSize: "1rem", textTransform: "none" }}
              >
                Remove
              </Button>
            </Box>
          </Box>

          {/* Search bar */}
          <TextField
            fullWidth
            label="Search customer..."
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
                            navigate(
                              `/personalTrainer/customers/${customer.id}`
                            )
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
                        <Checkbox
                          checked={selectedElements.includes(customer.id)}
                        />
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
                  No customer found
                </Typography>
              )}
            </List>
          </Paper>

          <Box display="flex" justifyContent="center" mt={3} gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrevPage}
              disabled={page === 0}
              sx={{ fontSize: "1rem", px: 3, textTransform: "none" }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleNextPage}
              disabled={
                startIndex + CUSTOMERS_PER_PAGE >= filteredCostumers.length
              }
              sx={{ fontSize: "1rem", px: 3, textTransform: "none" }}
            >
              Next
            </Button>
          </Box>
        </Paper>
        {isModalOpen && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 11, // it has a z index higher than the box that wrap all the content before
            }}
          >
            <AddCustomer onClose={() => setIsModalOpen(false)} personalTrainerId={user.id} />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Customers;
