import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { useNavigate } from "react-router";

interface dataForm {
  id: string;
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
  Email: string;
  NickName: string;
}

export default function CreateUser() {
  const [formData, setFormData] = useState<dataForm>({
    id: "",
    Name: "",
    Surname: "",
    DateOfBirth: "",
    Height: 0,
    Weight: 0,
    Email: "",
    NickName: "",
  });

  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Height" || name === "Weight" ? Number(value) : value,
    }));
  };

  const createUser = () => {
    if (!formData.Name || !formData.Surname || !formData.Email || !password) {
      setError("Please fill in all required fields.");
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

    setError("");
    FirestoreInterface.createCustomer(formData, password)
      .then(() => alert("User created successfully!"))
      .catch((err) => setError("Error: " + err.message));

    navigate("/personalTrainer/customers");
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form className="w-11/12 max-w-2xl bg-white p-10 shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Create New User</h2>

        {/* NickName */}
        <div className="mb-5">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Nick Name
          </label>
          <input
            className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Email
          </label>
          <input
            className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Password
          </label>
          <input
            className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
            type="password"
            name="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Nome e Cognome */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block text-gray-700 text-base font-bold mb-2">
              First Name
            </label>
            <input
              className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Last Name
            </label>
            <input
              className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
              type="text"
              name="Surname"
              value={formData.Surname}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Data di nascita */}
        <div className="mb-5">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Date of Birth
          </label>
          <input
            className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
            type="date"
            name="DateOfBirth"
            value={formData.DateOfBirth}
            onChange={handleChange}
          />
        </div>

        {/* Altezza e Peso */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Height (cm)
            </label>
            <input
              className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
              type="number"
              name="Height"
              value={formData.Height}
              onChange={handleChange}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Weight (kg)
            </label>
            <input
              className="block w-full bg-gray-200 border border-gray-300 rounded py-4 px-5"
              type="number"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Messaggio di errore */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Bottone Creazione */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={createUser}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg"
          >
            Create Customer
          </button>
        </div>
      </form>
    </div>
  );
}
