import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

// Interface for the form data structure
interface dataForm {
  id: string;
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number | "";
  Weight: number | "";
  Email: string;
  UserType: string;
  Limitations: string;
  GymLevel: string;
}

// Props expected by this component
interface AddCustomerProps {
  onClose: () => void;
  personalTrainerId: string;
}

export default function AddCustomer({
  onClose,
  personalTrainerId,
}: AddCustomerProps) {
  // State for the form inputs
  const [formData, setFormData] = useState<dataForm>({
    id: "",
    Name: "",
    Surname: "",
    DateOfBirth: "",
    Height: "",
    Weight: "",
    Email: "",
    UserType: "Customer",
    Limitations: "",
    GymLevel: "",
  });

  // Separate state for password and error message
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Handle changes in the form inputs
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // Parse numeric fields as numbers, leave empty string otherwise
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "Height" || name === "Weight"
          ? value === ""
            ? ""
            : Number(value)
          : value,
    }));
  };

  // Main function to validate and create a customer
  const createCustomer = () => {
    // Basic validations
    if (!formData.Name || !formData.Surname || !formData.Email || !password) {
      setError("Please fill all required fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      setError("Invalid email format.");
      return;
    }

    if (formData.Weight === "" || formData.Weight <= 0) {
      setError("Weight must be greater than 0");
      return;
    }

    if (formData.Height === "" || formData.Height <= 0) {
      setError("Height must be greater than 0");
      return;
    }

    // If validation passes, try to create the customer in Firestore
    setError("");
    FirestoreInterface.createCustomer(formData, password, personalTrainerId)
      .then(() => window.location.reload()) // Refresh page on success
      .catch(() => setError("This user already exists")); // Show error if user exists
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center flex-1 pl-10">
            Create Customer
          </h2>
          <IconButton
            onClick={onClose}
            sx={{
              color: "rgb(252, 252, 252)",
              backgroundColor: "rgb(190, 34, 34)",
              p: 0.5,
              width: 32,
              height: 32,
              "&:hover": {
                backgroundColor: "rgb(224, 60, 60)",
              },
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </div>

        {/* Form content */}
        <form className="space-y-4">
          {/* Nickname / ID field */}
          <div>
            <label className="block font-semibold text-lg">Nickname (ID)</label>
            <input
              className="input-style"
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold text-lg">Email</label>
            <input
              className="input-style"
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold text-lg">Password</label>
            <input
              className="input-style"
              type="password"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Name and Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-lg">First Name</label>
              <input
                className="input-style"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-lg">Last Name</label>
              <input
                className="input-style"
                type="text"
                name="Surname"
                value={formData.Surname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block font-semibold text-lg">Date of Birth</label>
            <input
              className="input-style"
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Height and Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-lg">Height (cm)</label>
              <input
                className="input-style"
                type="number"
                name="Height"
                value={formData.Height === "" ? "" : formData.Height}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold text-lg">Weight (kg)</label>
              <input
                className="input-style"
                type="number"
                name="Weight"
                value={formData.Weight === "" ? "" : formData.Weight}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Gym Level dropdown */}
          <div>
            <label className="block font-semibold text-lg">Gym Level</label>
            <select
              name="GymLevel"
              value={formData.GymLevel}
              onChange={handleChange}
              className="input-style"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Limitations textarea */}
          <div>
            <label className="block font-semibold text-lg">
              Limitations (optional)
            </label>
            <textarea
              className="input-style"
              name="Limitations"
              value={formData.Limitations}
              onChange={handleChange}
              maxLength={200}
              placeholder="Describe any limitations..."
            />
            <p className="text-sm text-gray-500">
              {formData.Limitations.length}/200
            </p>
          </div>

          {/* Display validation or API errors */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Submit button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={createCustomer}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md text-lg"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}