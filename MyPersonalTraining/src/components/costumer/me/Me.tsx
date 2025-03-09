import { useState } from "react";
import FirestoreInterface from "../../firebase/firestore/firestore-interface";

interface FormData {
  Name: string;
  Surname: string;
  DateOfBirth: string;
  Height: number;
  Weight: number;
}

export default function Me() {
  const userData = sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const [isEditing, setIsEditing] = useState(false);
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
    }
    setIsEditing(false);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100">
      <form className="w-11/12 max-w-2xl bg-white p-10 shadow-xl rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Personal Info</h2>

        {/* NickName */}
        <div className="mb-5">
          <label className="block uppercase tracking-wide text-gray-700 text-base font-bold mb-2">
            Nick Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
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
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
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
            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
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
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-300 rounded py-4 px-5 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="Weight"
              value={formData.Weight}
              onChange={handleChange}
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Bottone Modifica / Salva */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              if (isEditing) saveChanges();
              setIsEditing(!isEditing);
            }}
            className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 px-8 rounded-xl text-lg"
          >
            {isEditing ? "Salva" : "Modifica"}
          </button>
        </div>
      </form>
    </div>
  );
}
