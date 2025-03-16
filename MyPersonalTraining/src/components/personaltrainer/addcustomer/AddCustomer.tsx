import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

interface dataForm {
  id: string;
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
  Email: string;
}

interface AddCustomerProps {
  onClose: () => void;    // function used on closing window
  personalTrainerId : string
}

export default function AddCustomer({ onClose, personalTrainerId }: AddCustomerProps) {
  const [formData, setFormData] = useState<dataForm>({
    id: "",
    Name: "",
    Surname: "",
    DateOfBirth: "",
    Height: 0,
    Weight: 0,
    Email: "",
  });

  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Height" || name === "Weight" ? Number(value) : value,
    }));
  };

  const createCustomer = () => {
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
    if(formData.Weight <= 0){
      setError("Weight must be greater than 0");
      return;
    }
    if(formData.Height <= 0){
      setError("Height must be greater than 0");
      return;
    }

    setError("");
    FirestoreInterface.createCustomer(formData, password, personalTrainerId)
      .then(() => window.location.reload())
      .catch(() => setError("This user already exists"));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative w-full max-w-2xl bg-white p-6 rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
        
        {/* Title & close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center flex-1 pl-10">Create Customer</h2>
          <IconButton 
            onClick={onClose} 
            sx={{ 
              color: "rgb(252, 252, 252)", 
              backgroundColor: "rgb(190, 34, 34)", 
              p: 0.5, // Resize the button outline
              width: 32, 
              height: 32,
              "&:hover": {
                backgroundColor: "rgb(224, 60, 60)",
              }
            }}
          >
            <Close sx={{ fontSize: 18 }} />
          </IconButton>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {/* Nickname */}
          <div>
            <label className="block font-semibold">Nickname (ID)</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold">Email</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold">Password</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="password"
              name="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Name & Surname */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">First Name</label>
              <input
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold">Last Name</label>
              <input
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
                type="text"
                name="Surname"
                value={formData.Surname}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Date Of Birth */}
          <div>
            <label className="block font-semibold">Date of Birth</label>
            <input
              className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
              type="date"
              name="DateOfBirth"
              value={formData.DateOfBirth}
              onChange={handleChange}
            />
          </div>

          {/* Height & Weight */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Height (cm)</label>
              <input
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
                type="number"
                name="Height"
                value={formData.Height}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-semibold">Weight (kg)</label>
              <input
                className="w-full bg-gray-100 border border-gray-300 rounded-md p-3"
                type="number"
                name="Weight"
                value={formData.Weight}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Error message */}
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