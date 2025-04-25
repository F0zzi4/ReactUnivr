import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import FirebaseObject from "../../firebase/firestore/data-model/FirebaseObject";
import AddCustomer from "../addcustomer/AddCustomer";
import GenericList from "../../generic-list/GenericList";
import { useNavigate } from "react-router-dom";

function Customers() {
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [customers, setCustomers] = useState<FirebaseObject[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if the screen is small

  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Fetch customers
  useEffect(() => {
    const fetchData = async () => {
      if (user?.id) {
        const firebaseCustomers =
          await FirestoreInterface.getAllCustomersByPersonalTrainer(user.id);
        const customerPromises = firebaseCustomers.map(
          async (firebaseCustomer) => {
            const customer = await FirestoreInterface.getUserById(
              firebaseCustomer.id
            );
            return customer;
          }
        );

        const customers = await Promise.all(customerPromises);
        const validCustomers = customers.filter(
          (customer) => customer !== null
        );
        setCustomers(validCustomers as FirebaseObject[]);
      }
    };

    fetchData();
  }, []);

  // Filter customers based on search term
  const filteredCustomers = customers.filter((customer) =>
    `${customer.Name} ${customer.Surname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Handler to select/deselect a customer
  const handleToggle = (customer: FirebaseObject) => {
    setSelectedElements((prev) =>
      prev.includes(customer.id)
        ? prev.filter((id) => id !== customer.id)
        : [...prev, customer.id]
    );
  };

  // Remove selected customers
  const handleRemoveSelected = () => {
    setCustomers((prev) =>
      prev.filter((customer) => !selectedElements.includes(customer.id))
    );
    FirestoreInterface.deleteCustomers(selectedElements, user.id);
    setSelectedElements([]);
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
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
            flexDirection={isSmallScreen ? "column" : "row"} // Change direction on small screens
            gap={isSmallScreen ? 2 : 0} // Add vertical spacing on small screens
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                fontSize: isSmallScreen ? "1.5rem" : "2rem", // Reduce text size on small screens
                textAlign: isSmallScreen ? "center" : "left", // Center text on small screens
              }}
            >
              Customers
            </Typography>
            <Box
              display="flex"
              gap={1} // Reduce space between buttons
              flexWrap={isSmallScreen ? "wrap" : "nowrap"} // Wrap buttons on small screens
              justifyContent={isSmallScreen ? "center" : "flex-end"} // Center buttons on small screens
            >
              <Button
                variant="contained"
                color="success"
                startIcon={<Add />}
                onClick={() => setIsModalOpen(true)}
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem", // Reduce text size on small screens
                  "&:hover": {
                    backgroundColor: "rgb(22, 170, 42)",
                  },
                  textTransform: "none",
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
                sx={{
                  fontSize: isSmallScreen ? "0.875rem" : "1rem", // Reduce text size on small screens
                  "&:hover": {
                    backgroundColor: "rgb(170, 22, 22)",
                  },
                  textTransform: "none",
                }}
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
          <GenericList
            items={filteredCustomers}
            selectedItems={selectedElements}
            onToggle={handleToggle}
            onItemClick={(customer) => {
              navigate("/personal-trainer/customers/customer", {
                state: { customer },
              });
            }}
            primaryText={(customer) => `${customer.Name} ${customer.Surname}`}
          />
        </Paper>
        {isModalOpen && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              zIndex: 11,
            }}
          >
            <AddCustomer
              onClose={() => setIsModalOpen(false)}
              personalTrainerId={user.id}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Customers;
