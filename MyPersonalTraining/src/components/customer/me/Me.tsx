import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";
import { Typography } from "@mui/material";

interface FormData {
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
}

export default function Me() {
  const [isEditing, setIsEditing] = useState(false);
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [formData, setFormData] = useState<FormData>({
    Name: user?.Name || "",
    Surname: user?.Surname || "",
    DateOfBirth: user?.DateOfBirth || "",
    Height: user?.Height || 0,
    Weight: user?.Weight || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log();
    setFormData((prev) => ({
      ...prev,
      [name]: name === "Height" || name === "Weight" ? Number(value) : value,
    }));
  };

  const saveChanges = () => {
    if (user) {
      const updatedUser = { ...user, ...formData };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      FirestoreInterface.updateUser(updatedUser);
      window.location.reload();
    }
    setIsEditing(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form className="w-11/12 max-w-2xl p-10 shadow-xl rounded-xl" style={{ backgroundColor: "rgb(147, 229, 165)" }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
            color: "#333",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
            background: "linear-gradient(to right,rgb(50, 197, 112),rgb(30, 129, 71))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Personal Info
        </Typography>

        {/* NickName */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Nick Name
          </label>
          <input
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
            type="text"
            value={user?.id || ""}
            readOnly
          />
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Email
          </label>
          <input
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
            type="email"
            value={user?.Email || ""}
            readOnly
          />
        </div>

        {/* Nome e Cognome */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              First Name
            </label>
            <input
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Last Name
            </label>
            <input
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="Surname"
              value={formData.Surname}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Data di nascita */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Date of Birth
          </label>
          <input
            className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
            type="date"
            name="DateOfBirth"
            value={formData.DateOfBirth}
            onChange={handleChange}
            readOnly={!isEditing}
          />
        </div>

        {/* Altezza e Peso */}
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Height (cm)
            </label>
            <input
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="Height"
              value={formData.Height}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
              Weight (kg)
            </label>
            <input
              className="appearance-none block w-full bg-white text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>
        {/* Save / Edit Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (isEditing) saveChanges();
              setIsEditing(!isEditing);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-7 rounded-md text-lg"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
      </form>
    </div>
  );
}
